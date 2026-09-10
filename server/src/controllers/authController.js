const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });

const formatUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  contactNumber: user.contactNumber,
  email: user.email,
  role: user.role || "user",
  isProfileCompleted: user.isProfileCompleted,
  createdAt: user.createdAt,
});

//=========================================USER========================
// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, contactNumber, email, password } = req.body;

    if (!fullName || !contactNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { contactNumber }],
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Email or contact number already registered" });
    }

    const user = await User.create({ fullName, contactNumber, email, password });
    const token = generateToken(user._id);

    console.log("Register token:", token);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({ message: "Email/mobile and password required" });
    }

    const formattedInput = String(emailOrMobile).trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: formattedInput },
        { contactNumber: String(emailOrMobile).trim() }
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(String(password));
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    console.log("Login token:", token);
    return res.json({
      token,
      user: formatUser(user),
      isProfileCompleted: user.isProfileCompleted,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email address is required" });
    }

    const formattedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: formattedEmail });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email address" });
    }

    // Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Invalidate old OTPs for this email and save new OTP
    await Otp.deleteMany({ email: formattedEmail });
    await Otp.create({ email: formattedEmail, otp });

    console.log(`[AUTH] Password Reset OTP for ${formattedEmail}: ${otp}`);

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
          <h2 style="color: #6d28d9; margin: 0; font-size: 24px; font-weight: 800;">Sathi Meet</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Password Reset Verification Code</p>
        </div>
        <div style="padding: 24px 8px; text-align: center;">
          <p style="color: #334155; font-size: 15px; margin-bottom: 20px; line-height: 1.5;">
            Hello <strong>${user.fullName || "User"}</strong>,<br/>
            We received a request to reset your password. Use the verification code (OTP) below to proceed:
          </p>
          <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 16px 24px; border-radius: 12px; display: inline-block; margin: 10px 0 20px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);">
            ${otp}
          </div>
          <p style="color: #ef4444; font-size: 13px; font-weight: 600; margin: 8px 0;">
            This OTP is valid for 10 minutes.
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; line-height: 1.4;">
            If you did not request a password reset, please ignore this email or contact our support team.
          </p>
        </div>
        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Sathi Meet. All rights reserved.
        </div>
      </div>
    `;

    try {
      await sendEmail(
        formattedEmail,
        "Password Reset Verification Code - Sathi Meet",
        emailHtml
      );
    } catch (emailErr) {
      console.error("[AUTH] Email dispatch error:", emailErr);
    }

    return res.status(200).json({
      message: "Verification code sent to your email address.",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: err.message || "Failed to process forgot password request" });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const formattedEmail = String(email).trim().toLowerCase();
    const formattedOtp = String(otp).trim();

    // Verify OTP against Otp collection
    const otpRecord = await Otp.findOne({ email: formattedEmail, otp: formattedOtp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP. Please request a new code." });
    }

    const user = await User.findOne({ email: formattedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update password (pre-save hook hashes password)
    user.password = String(newPassword);
    await user.save();

    // Delete used OTP
    await Otp.deleteMany({ email: formattedEmail });

    return res.status(200).json({
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: err.message || "Failed to reset password" });
  }
};

//======================ADMIN-==========================================================
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select("+password");

    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await user.comparePassword(String(password));
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: formatUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Admin login failed" });
  }
};
