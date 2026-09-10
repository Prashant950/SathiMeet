const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getDashboardAnalytics,
  getUsers,
  updateUser,
  getUserAuditDetails,
  updateUserAuditDetails,
  getBookings,
  updateBooking,
  getServices,
  createService,
  updateService,
  deleteService,
  getTransactions, getProfile,
  updateProfile,
  changePassword, } = require("../controllers/adminController");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/analytics", getDashboardAnalytics)
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.get("/users/:id/audit-details", getUserAuditDetails);
router.put("/users/:id/audit-update", updateUserAuditDetails);
router.get("/bookings", getBookings);
router.put("/bookings/:id", updateBooking);
router.get("/services", getServices);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

// admin profile
router.get("/me", getProfile);
router.put("/update-profile", updateProfile);
router.put("/change-password", changePassword);

router.get("/transactions", getTransactions);

module.exports = router;