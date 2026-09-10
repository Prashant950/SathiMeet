const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Payment = require("../models/Payment");
const User = require("../models/User");
const ServiceCatalog = require("../models/ServiceCatalog");
const Booking = require("../models/Booking");

const { RAZORPAY_API_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_API_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

const DEFAULT_SERVICES = [
  {
    title: "Movie Partner",
    slug: "movie-partner",
    category: "entertainment",
    rate: 1,
    durationUnit: "session",
    tag: "Popular",
    rating: 4.9,
    description: "Watch the latest cinema releases, movie marathons, or theater premieres together.",
    color: "from-violet-600 to-indigo-500",
    isActive: true,
  },
  {
    title: "In Person Meeting",
    slug: "in-person-meeting",
    category: "social",
    rate: 1,
    durationUnit: "session",
    tag: "Trending",
    rating: 5.0,
    description: "Meet verified friendly partners in safe, public settings for meaningful companionship.",
    color: "from-blue-600 to-cyan-500",
    isActive: true,
  },
  {
    title: "Elder Care",
    slug: "elder-care",
    category: "care",
    rate: 1000,
    durationUnit: "session",
    tag: "Trusted Care",
    rating: 4.9,
    description: "Compassionate, patient assistance & everyday care for senior citizens and elders.",
    color: "from-emerald-600 to-teal-500",
    isActive: true,
  },
  {
    title: "House Keeping",
    slug: "house-keeping",
    category: "care",
    rate: 1500,
    durationUnit: "session",
    tag: "Essential",
    rating: 4.7,
    description: "Home organization, light tidying, decluttering, and housekeeping support.",
    color: "from-amber-600 to-yellow-500",
    isActive: true,
  },
  {
    title: "Clubbing",
    slug: "clubbing",
    category: "entertainment",
    rate: 4500,
    durationUnit: "session",
    tag: "VIP Nightlife",
    rating: 4.8,
    description: "Lively, safe, and exciting nightlife partner for parties, lounges, and weekend clubs.",
    color: "from-fuchsia-600 to-pink-500",
    isActive: true,
  },
  {
    title: "Shopping Buddy",
    slug: "shopping-buddy",
    category: "social",
    rate: 2000,
    durationUnit: "session",
    tag: "Lifestyle",
    rating: 4.8,
    description: "Fashion advice, mall trips, styling tips, and friendly retail therapy companion.",
    color: "from-rose-600 to-red-500",
    isActive: true,
  },
  {
    title: "City Tour Partner",
    slug: "city-tour-partner",
    category: "travel",
    rate: 2000,
    durationUnit: "session",
    tag: "Explorer",
    rating: 4.9,
    description: "Explore heritage spots, scenic viewpoints, hidden city gems, and local markets.",
    color: "from-cyan-600 to-blue-500",
    isActive: true,
  },
  {
    title: "Gaming Partner (Physical)",
    slug: "gaming-partner",
    category: "entertainment",
    rate: 1800,
    durationUnit: "session",
    tag: "Fun & Games",
    rating: 4.9,
    description: "Arcade arenas, bowling alleys, board games, VR zones, or console gaming sessions.",
    color: "from-indigo-600 to-purple-500",
    isActive: true,
  },
  {
    title: "Concert Partner",
    slug: "concert-partner",
    category: "entertainment",
    rate: 2000,
    durationUnit: "session",
    tag: "Live Music",
    rating: 4.9,
    description: "Enjoy music festivals, live gigs, theater shows, and stadium concerts together.",
    color: "from-purple-600 to-violet-500",
    isActive: true,
  },
  {
    title: "Coffee Partner",
    slug: "coffee-partner",
    category: "social",
    rate: 1500,
    durationUnit: "session",
    tag: "Casual & Warm",
    rating: 5.0,
    description: "Relaxed coffee shop conversations, peaceful reading time, and friendly chats.",
    color: "from-orange-600 to-amber-500",
    isActive: true,
  },
  {
    title: "Cafe & Food Partner",
    slug: "cafe-food-partner",
    category: "social",
    rate: 2000,
    durationUnit: "session",
    tag: "Foodie",
    rating: 4.9,
    description: "Discover trendy cafes, gourmet restaurants, street food hubs, and dessert parlors.",
    color: "from-teal-600 to-emerald-500",
    isActive: true,
  },
  {
    title: "Professional Networking Partner",
    slug: "professional-networking",
    category: "social",
    rate: 1500,
    durationUnit: "session",
    tag: "Career & Tech",
    rating: 4.8,
    description: "Accompany you to business conferences, tech seminars, summits, and corporate mixers.",
    color: "from-slate-700 to-slate-900",
    isActive: true,
  },
];

// GET /api/payment/catalog - Public Catalog fetched from MongoDB
exports.getPublicServicesCatalog = async (req, res) => {
  try {
    let services = await ServiceCatalog.find({ isActive: true }).sort({ createdAt: 1 });

    // Auto-seed if database collection is empty
    if (!services || services.length === 0) {
      await ServiceCatalog.insertMany(DEFAULT_SERVICES);
      services = await ServiceCatalog.find({ isActive: true }).sort({ createdAt: 1 });
    }

    res.status(200).json({
      success: true,
      data: services,
      total: services.length,
    });
  } catch (error) {
    console.error("Error fetching public services catalog:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching services catalog",
      error: error.message,
    });
  }
};

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { services, subtotal, gst, total } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!services || services.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No services selected" });
    }

    if (!total || total <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Resolve real ServiceCatalog IDs from MongoDB
    const enrichedServices = await Promise.all(
      services.map(async (s) => {
        let realCatalogId = null;
        if (s.serviceId && mongoose.Types.ObjectId.isValid(s.serviceId)) {
          const exists = await ServiceCatalog.findById(s.serviceId);
          if (exists) realCatalogId = exists._id;
        }

        if (!realCatalogId) {
          const dbService = await ServiceCatalog.findOne({
            $or: [
              { slug: String(s.serviceId || s.title || "").toLowerCase().replace(/\s+/g, "-") },
              { title: s.title },
            ],
          });
          if (dbService) realCatalogId = dbService._id;
        }

        return {
          serviceId: realCatalogId ? realCatalogId.toString() : s.serviceId,
          catalogId: realCatalogId || undefined,
          title: s.title,
          price: s.price,
        };
      })
    );

    // Convert amount to paise (Razorpay accepts amount in smallest currency unit)
    const amountInPaise = Math.round(total * 100);

    // Create Razorpay Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        serviceCount: services.length,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Failed to create Razorpay order",
      });
    }

    // Save payment record in DB with "pending" status and real MongoDB IDs
    const payment = await Payment.create({
      userId: userId,
      orderId: order.id,
      services: enrichedServices,
      subtotal: subtotal,
      gst: gst,
      amount: total,
      currency: "INR",
      status: "pending",
      userEmail: user.email,
      userName: user.fullName,
    });

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: RAZORPAY_API_KEY,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Verify Payment & Update DB
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    // Verify Razorpay signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET_KEY)
      .update(body)
      .digest("hex");

    const isSignatureValid = expectedSignature === signature;

    if (!isSignatureValid) {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { orderId: orderId },
        { status: "failed", paymentId: paymentId, signature: signature },
        { returnDocument: "after" }
      );

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Update payment status to completed
    const payment = await Payment.findOneAndUpdate(
      { orderId: orderId },
      {
        status: "completed",
        paymentId: paymentId,
        signature: signature,
      },
      { returnDocument: "after" }
    ).populate("userId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Automatically create confirmed booking records in DB with real ServiceCatalog IDs
    if (payment.services && payment.services.length > 0) {
      for (const s of payment.services) {
        let catalogId = s.catalogId;
        if (!catalogId && s.serviceId && mongoose.Types.ObjectId.isValid(s.serviceId)) {
          catalogId = s.serviceId;
        }

        // Validity period: 30 days from purchase
        const validTill = new Date();
        validTill.setDate(validTill.getDate() + 30);

        await Booking.create({
          userId: payment.userId._id || payment.userId,
          serviceId: catalogId || undefined,
          serviceName: s.title,
          bookingDate: new Date(),
          slot: "Flexible Companion Session",
          location: "Selected City Venue",
          amount: s.price,
          status: "Confirmed",
          paymentDetails: {
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            razorpaySignature: signature,
            paymentStatus: "paid",
            paidAt: new Date(),
          },
          notes: `Booked via Razorpay Order #${orderId}`,
        });
      }
    }

    // Send confirmation email (non-blocking - don't wait for it)
    const emailHtml = generatePaymentConfirmationEmail(
      payment.userName,
      payment.services,
      payment.subtotal,
      payment.gst,
      payment.amount,
      paymentId
    );

    // Send email in background without blocking the response
    sendEmail(
      payment.userEmail,
      "Payment Confirmation - Services Booked",
      emailHtml
    ).catch((err) => {
      console.error("Background email sending failed:", err.message);
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentData: payment,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

// Get Payment Details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findById(paymentId).populate("userId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Verify that the payment belongs to the logged-in user
    if (payment.userId._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment details",
      error: error.message,
    });
  }
};

// Get All Payments of a User
exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;

    const payments = await Payment.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("userId");

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

// Handle Payment Failure
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, paymentId, reason } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const payment = await Payment.findOneAndUpdate(
      { orderId: orderId },
      {
        status: "failed",
        paymentId: paymentId || null,
      },
      { returnDocument: "after" }
    ).populate("userId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Send failure notification email
    const emailHtml = generatePaymentFailureEmail(
      payment.userName,
      payment.amount,
      reason
    );

    await sendEmail(
      payment.userEmail,
      "Payment Failed - Action Required",
      emailHtml
    );

    res.status(200).json({
      success: true,
      message: "Payment failure recorded",
      data: payment,
    });
  } catch (error) {
    console.error("Error handling payment failure:", error);
    res.status(500).json({
      success: false,
      message: "Error handling payment failure",
      error: error.message,
    });
  }
};

// Helper function to generate payment confirmation email
const generatePaymentConfirmationEmail = (
  userName,
  services,
  subtotal,
  gst,
  total,
  paymentId
) => {
  const servicesList = services
    .map(
      (service) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${service.title}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ₹${service.price.toLocaleString("en-IN")}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
          .summary { background: white; padding: 15px; border-radius: 8px; margin-top: 15px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .summary-row.total { font-size: 18px; font-weight: bold; color: #667eea; border-bottom: none; padding-top: 15px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; margin-top: 15px; }
          th { background: #667eea; color: white; padding: 12px; text-align: left; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmation ✓</h1>
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for your payment! Your services have been successfully booked. Here are your details:</p>
            
            <table>
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${servicesList}
              </tbody>
            </table>
            
            <div class="summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div class="summary-row">
                <span>GST (18%):</span>
                <span>₹${gst.toLocaleString("en-IN")}</span>
              </div>
              <div class="summary-row total">
                <span>Total Amount:</span>
                <span>₹${total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            
            <p style="margin-top: 15px; color: #6b7280;">
              <strong>Payment ID:</strong> ${paymentId}
            </p>
            
            <p>Your services are now active and ready to use. You can start booking immediately.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Sathi Meet. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Helper function to generate payment failure email
const generatePaymentFailureEmail = (userName, amount, reason) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #fee2e2; color: #991b1b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fef2f2; padding: 20px; border: 1px solid #fecaca; border-top: none; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Failed ✗</h1>
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Unfortunately, your payment of <strong>₹${amount.toLocaleString("en-IN")}</strong> could not be processed.</p>
            
            <p><strong>Reason:</strong> ${reason || "Transaction declined by your bank"}</p>
            
            <p>Please try again or use a different payment method. If the issue persists, please contact our support team.</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Sathi Meet. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = exports;
