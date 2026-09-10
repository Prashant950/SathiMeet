const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  getUserPayments,
  handlePaymentFailure,
  getPublicServicesCatalog,
} = require("../controllers/paymentController");

// Public routes - accessible without login
router.get("/catalog", getPublicServicesCatalog);

// Protect all following routes - user must be authenticated
router.use(protect);

// Create a new payment order
router.post("/create-order", createOrder);

// Verify payment and update database
router.post("/verify-payment", verifyPayment);

// Handle payment failure
router.post("/payment-failure", handlePaymentFailure);

// Get payment details by ID
router.get("/payment/:paymentId", getPaymentDetails);

// Get all payments of the logged-in user
router.get("/my-payments", getUserPayments);

module.exports = router;
