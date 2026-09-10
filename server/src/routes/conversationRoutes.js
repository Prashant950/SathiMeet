const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getConversations,
  getConversation,
  markConversationAsRead,
  getOrCreateWithUser,
  sendMessage,
  startCall,
  getIncomingCall,
  getCallStatus,
  respondCall,
  endCall,
} = require("../controllers/conversationController");

const router = express.Router();

// Call signaling endpoints (must be defined before /:id)
router.post("/call/start", protect, startCall);
router.get("/call/incoming", protect, getIncomingCall);
router.get("/call/status/:id", protect, getCallStatus);
router.post("/call/respond", protect, respondCall);
router.post("/call/end", protect, endCall);

// Conversation endpoints
router.get("/", protect, getConversations);
router.get("/:id", protect, getConversation);
router.put("/:id/read", protect, markConversationAsRead);
router.post("/with-user/:otherUserId", protect, getOrCreateWithUser);
router.post("/:id/messages", protect, sendMessage);

module.exports = router;
