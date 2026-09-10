const express = require("express");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

// Allow image uploads (supports both authenticated and onboarding flows)
router.post("/image", uploadImage);

module.exports = router;
