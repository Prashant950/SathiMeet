const express = require("express");
const { protect } = require("../middleware/auth");
const {
  saveProfile,
  getMyProfile,
  updateProfile,
  getMyPurchasedServices
} = require("../controllers/profileController");

const router = express.Router();

router.post("/save", protect, saveProfile);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateProfile);
router.get("/my-services", protect, getMyPurchasedServices);

module.exports = router;
