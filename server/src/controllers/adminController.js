const User = require("../models/User");
const Profile = require("../models/Profile");
const Interaction = require("../models/Interaction");
const Call = require("../models/Call");
const Conversation = require("../models/Conversation");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const ServiceCatalog = require("../models/ServiceCatalog");
const bcrypt = require("bcryptjs");

// --- DASHBOARD ANALYTICS OVERVIEW ---
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenueResult = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const activeServicesCount = await ServiceCatalog.countDocuments({ isActive: true });

    const recentBookings = await Booking.find()
      .populate("userId", "fullName email contactNumber")
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalRevenue,
        activeServicesCount,
        recentBookings,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- USER MANAGEMENT CONTROLLERS ---
exports.getUsers = async (req, res) => {
  try {
    const { search = "", role, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { contactNumber: { $regex: search, $options: "i" } },
      ];
    }
    if (role) query.role = role;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isBlocked, isProfileCompleted } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { ...(role && { role }), ...(typeof isBlocked === "boolean" && { isBlocked }), ...(typeof isProfileCompleted === "boolean" && { isProfileCompleted }) },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User modified", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- GET FULL USER AUDIT DETAILS (PROFILE, LIKES, CALLS, CHATS, BOOKINGS) ---
exports.getUserAuditDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: id });

    // Outgoing Swipes (Likes, Passes, Superlikes)
    const outgoingInteractions = await Interaction.find({ userId: id })
      .populate("targetUserId", "fullName email contactNumber")
      .sort({ createdAt: -1 });

    // Incoming Swipes (Who liked this user)
    const incomingInteractions = await Interaction.find({ targetUserId: id })
      .populate("userId", "fullName email contactNumber")
      .sort({ createdAt: -1 });

    // Audio & Video Calls
    const calls = await Call.find({
      $or: [{ callerId: id }, { receiverId: id }],
    }).sort({ createdAt: -1 });

    // Conversations & Messages
    const conversations = await Conversation.find({ participants: id })
      .populate("participants", "fullName email contactNumber")
      .sort({ updatedAt: -1 });

    // Bookings & Payments
    const bookings = await Booking.find({ userId: id })
      .populate("serviceId", "title price category")
      .sort({ createdAt: -1 });

    const payments = await Payment.find({ userId: id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user,
        profile,
        outgoingInteractions,
        incomingInteractions,
        calls,
        conversations,
        bookings,
        payments,
      },
    });
  } catch (err) {
    console.error("Error fetching user audit details:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- UPDATE FULL USER AUDIT DETAILS (PROFILE, PHOTOS, BASIC INFO) ---
exports.updateUserAuditDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      contactNumber,
      role,
      isBlocked,
      isProfileCompleted,
      age,
      gender,
      city,
      state,
      bio,
      jobTitle,
      company,
      educationLevel,
      university,
      interests,
      lookingFor,
      photos,
    } = req.body;

    // 1. Update User Document
    const userUpdate = {};
    if (fullName !== undefined) userUpdate.fullName = fullName;
    if (email !== undefined) userUpdate.email = email;
    if (contactNumber !== undefined) userUpdate.contactNumber = contactNumber;
    if (role !== undefined) userUpdate.role = role;
    if (isBlocked !== undefined) userUpdate.isBlocked = isBlocked;
    if (isProfileCompleted !== undefined) userUpdate.isProfileCompleted = isProfileCompleted;

    const user = await User.findByIdAndUpdate(id, userUpdate, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Update Profile Document
    const profileUpdate = {};
    if (age !== undefined) profileUpdate.age = Number(age);
    if (gender !== undefined) profileUpdate.gender = gender;
    if (bio !== undefined) profileUpdate.bio = bio;
    if (jobTitle !== undefined) profileUpdate.jobTitle = jobTitle;
    if (company !== undefined) profileUpdate.company = company;
    if (educationLevel !== undefined) profileUpdate.educationLevel = educationLevel;
    if (university !== undefined) profileUpdate.university = university;
    if (interests !== undefined) profileUpdate.interests = Array.isArray(interests) ? interests : [];
    if (lookingFor !== undefined) profileUpdate.lookingFor = Array.isArray(lookingFor) ? lookingFor : [];
    if (photos !== undefined) profileUpdate.photos = Array.isArray(photos) ? photos : [];

    if (city !== undefined || state !== undefined) {
      profileUpdate["location.city"] = city || "";
      profileUpdate["location.state"] = state || "";
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: id },
      { $set: profileUpdate },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "User profile updated successfully by Admin",
      user,
      profile,
    });
  } catch (err) {
    console.error("Error updating user audit details:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- BOOKINGS & DETAILS ---
exports.getBookings = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (paymentStatus) query["paymentDetails.paymentStatus"] = paymentStatus;

    const bookings = await Booking.find(query)
      .populate("userId", "fullName email contactNumber")
      .populate("serviceId", "title category")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      bookings,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes) updateFields.notes = notes;
    if (paymentStatus) updateFields["paymentDetails.paymentStatus"] = paymentStatus;

    const booking = await Booking.findByIdAndUpdate(id, { $set: updateFields }, { new: true })
      .populate("userId", "fullName email");

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.status(200).json({ success: true, message: "Booking updated", booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- SERVICE CATALOG MANAGEMENT ---
exports.getServices = async (req, res) => {
  try {
    const services = await ServiceCatalog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const { title, category, rate, durationUnit, description, features, isActive } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const service = await ServiceCatalog.create({
      title,
      slug,
      category,
      rate,
      durationUnit,
      description,
      features,
      isActive,
    });

    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServiceCatalog.findByIdAndUpdate(id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    res.status(200).json({ success: true, message: "Service updated", service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await ServiceCatalog.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Service removed from catalog" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- TRANSACTIONS & RAZORPAY LOGS ---
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Payment.find()
      .select("userId userName orderId paymentId amount status services createdAt")
      .populate("userId", "fullName email contactNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me (Get logged in Admin/User profile)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/auth/update-profile (Update Name & Email)
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const updateData = {};

    if (fullName) updateData.fullName = fullName.trim();
    if (email) {
      const emailLower = email.trim().toLowerCase();
      // Check if another user already has this email
      const existingUser = await User.findOne({
        email: emailLower,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email is already taken" });
      }
      updateData.email = emailLower;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/auth/change-password (Verify Current & Set New Password)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All password fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Hash and update to new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};