const Profile = require("../models/Profile");
const User = require("../models/User");
const Payment = require("../models/Payment");

// POST /api/profile/save
exports.saveProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, contactNumber, ...data } = req.body;

    if (fullName || contactNumber) {
      const userUpdate = {};
      if (fullName) userUpdate.fullName = fullName;
      if (contactNumber) userUpdate.contactNumber = contactNumber;
      await User.findByIdAndUpdate(userId, userUpdate);
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true, runValidators: true }
    );

    await User.findByIdAndUpdate(userId, { isProfileCompleted: true });

    const user = await User.findById(userId).select("fullName email contactNumber role");

    res.status(201).json({
      message: "Profile saved successfully",
      profile: {
        ...profile.toObject(),
        fullName: user?.fullName,
        email: user?.email,
        contactNumber: user?.contactNumber,
      },
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/profile/me
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    const user = await User.findById(req.user._id).select("fullName email contactNumber role");

    if (!profile) {
      return res.json({
        fullName: user?.fullName || "Companion",
        email: user?.email || "",
        contactNumber: user?.contactNumber || "",
        age: 24,
        gender: "Female",
        interests: ["Music", "Coffee", "Travel"],
        photos: [],
        location: { city: "Mumbai, India" },
        bio: "Looking to make meaningful companion connections on Sathi Meet.",
      });
    }

    res.json({
      ...profile.toObject(),
      fullName: user?.fullName || req.user.fullName,
      email: user?.email || req.user.email,
      contactNumber: user?.contactNumber || req.user.contactNumber,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/profile/me
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, contactNumber, ...profileData } = req.body;

    if (fullName || contactNumber) {
      const userUpdate = {};
      if (fullName) userUpdate.fullName = fullName;
      if (contactNumber) userUpdate.contactNumber = contactNumber;
      await User.findByIdAndUpdate(userId, userUpdate);
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...profileData, userId },
      { new: true, upsert: true, runValidators: true }
    );

    const updatedUser = await User.findById(userId).select("fullName email contactNumber role");

    res.json({
      message: "Profile updated successfully",
      profile: {
        ...profile.toObject(),
        fullName: updatedUser?.fullName,
        email: updatedUser?.email,
        contactNumber: updatedUser?.contactNumber,
      },
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/profile/my-services - Get all services purchased by the user
exports.getMyPurchasedServices = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all completed payments for this user
    const payments = await Payment.find({
      userId: userId,
      status: "completed"
    }).sort({ createdAt: -1 });

    if (!payments || payments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No services purchased yet",
        data: []
      });
    }

    // Extract and flatten all services from payments
    const purchasedServices = [];
    const serviceIdMap = new Map();

    payments.forEach((payment) => {
      payment.services.forEach((service) => {
        const key = service.serviceId;
        
        if (!serviceIdMap.has(key)) {
          serviceIdMap.set(key, {
            serviceId: service.serviceId,
            title: service.title,
            price: service.price,
            purchaseCount: 1,
            lastPurchasedAt: payment.createdAt,
            purchaseHistory: [{
              orderId: payment.orderId,
              paymentId: payment.paymentId,
              amount: service.price,
              purchasedAt: payment.createdAt,
              status: payment.status
            }]
          });
        } else {
          const existing = serviceIdMap.get(key);
          existing.purchaseCount += 1;
          existing.lastPurchasedAt = payment.createdAt;
          existing.purchaseHistory.push({
            orderId: payment.orderId,
            paymentId: payment.paymentId,
            amount: service.price,
            purchasedAt: payment.createdAt,
            status: payment.status
          });
        }
      });
    });

    // Convert map to array and sort by purchase date
    const services = Array.from(serviceIdMap.values()).sort(
      (a, b) => new Date(b.lastPurchasedAt) - new Date(a.lastPurchasedAt)
    );

    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services,
      totalServices: services.length,
      totalSpent: payments.reduce((sum, payment) => sum + payment.amount, 0)
    });

  } catch (error) {
    console.error("Error fetching purchased services:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching services",
      error: error.message
    });
  }
};
