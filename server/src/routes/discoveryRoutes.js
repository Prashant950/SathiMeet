const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getDiscovery,
  getMatches,
} = require("../controllers/discoveryController");

const router = express.Router();

router.get("/discovery", protect, getDiscovery);
router.get("/matches", protect, getMatches);

module.exports = router;
