const express = require("express");
const { protect } = require("../middleware/auth");
const { swipe, likeBack } = require("../controllers/interactionController");

const router = express.Router();

router.post("/swipe", protect, swipe);
router.post("/like-back", protect, likeBack);

module.exports = router;
