const Conversation = require("../models/Conversation");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Call = require("../models/Call");

const enrichConversation = async (conv, currentUserId) => {
  const currentUserIdStr = currentUserId.toString();
  const otherId = conv.participants.find(
    (p) => p && p.toString() !== currentUserIdStr
  );

  let profile = null;
  let user = null;

  if (otherId) {
    profile = await Profile.findOne({ userId: otherId });
    user = await User.findById(otherId).select("fullName email contactNumber");
  }

  // Count unread messages sent by the other person to current user
  const unreadCount = (conv.messages || []).filter(
    (m) => m && m.senderId && m.senderId.toString() !== currentUserIdStr && !m.isRead
  ).length;

  const photos = profile?.photos && profile.photos.length > 0
    ? profile.photos
    : ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop"];

  return {
    ...conv.toObject(),
    unreadCount,
    otherUserId: otherId ? otherId.toString() : null,
    otherUser: {
      userId: otherId ? otherId.toString() : null,
      _id: otherId ? otherId.toString() : null,
      fullName: user?.fullName || profile?.jobTitle || "Match",
      name: user?.fullName || profile?.jobTitle || "Match",
      photo: photos[0],
      photos,
      jobTitle: profile?.jobTitle || "Verified Companion",
      city: profile?.location?.city || "Mumbai, India",
      isOnline: profile?.isOnline !== false,
      age: profile?.age || 24,
    },
  };
};

// GET /api/conversations
exports.getConversations = async (req, res) => {
  try {
    const convs = await Conversation.find({
      participants: { $in: [req.user._id] },
    }).sort({ updatedAt: -1 });

    const enriched = await Promise.all(
      convs.map((c) => enrichConversation(c, req.user._id))
    );

    const totalUnreadCount = enriched.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

    res.json({
      conversations: enriched,
      totalUnreadCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/conversations/:id (Pure GET - does NOT automatically mark as read)
exports.getConversation = async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conv.participants.some(
      (p) => p && p.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const enriched = await enrichConversation(conv, req.user._id);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/conversations/:id/read (Explicitly called ONLY when user opens and views the chat)
exports.markConversationAsRead = async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conv.participants.some(
      (p) => p && p.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let modified = false;
    const currentUserIdStr = req.user._id.toString();

    conv.messages.forEach((m) => {
      // Mark as read only messages sent by the other participant
      if (m && m.senderId && m.senderId.toString() !== currentUserIdStr && !m.isRead) {
        m.isRead = true;
        m.readAt = new Date();
        modified = true;
      }
    });

    if (modified) {
      await conv.save();
    }

    const enriched = await enrichConversation(conv, req.user._id);
    res.json({ success: true, conversation: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/conversations/with-user/:otherUserId
exports.getOrCreateWithUser = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const otherUserId = req.params.otherUserId.toString();

    if (currentUserId === otherUserId) {
      return res.status(400).json({ message: "Cannot create conversation with yourself" });
    }

    const sorted = [currentUserId, otherUserId].sort();

    let conv = await Conversation.findOne({
      participants: { $all: sorted, $size: 2 },
    });

    if (!conv) {
      conv = await Conversation.create({
        participants: sorted,
        lastMessage: "It's a Match! Say hello! 👋",
        messages: [],
      });
    }

    const enriched = await enrichConversation(conv, req.user._id);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/conversations/:id/messages
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: "Message text required" });
    }

    const conv = await Conversation.findById(req.params.id);
    if (!conv) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conv.participants.some(
      (p) => p && p.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const message = {
      senderId: req.user._id,
      text: text.trim(),
      isRead: false,
      readAt: null,
    };

    conv.messages.push(message);
    conv.lastMessage = text.trim();
    conv.updatedAt = new Date();
    await conv.save();

    const newMsg = conv.messages[conv.messages.length - 1];
    const enriched = await enrichConversation(conv, req.user._id);

    res.status(201).json({ message: newMsg, conversation: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




//=====================================Calling============================================

// Helper to auto-record call log messages into MongoDB Conversation
const recordCallMessageInConversation = async (callerId, receiverId, text) => {
  try {
    const sorted = [callerId.toString(), receiverId.toString()].sort();
    let conv = await Conversation.findOne({
      participants: { $all: sorted, $size: 2 },
    });

    if (!conv) {
      conv = await Conversation.create({
        participants: sorted,
        lastMessage: text,
        messages: [],
      });
    }

    conv.messages.push({
      senderId: callerId,
      text: text,
      isRead: false,
      readAt: null,
      createdAt: new Date(),
    });
    conv.lastMessage = text;
    conv.updatedAt = new Date();
    await conv.save();
  } catch (err) {
    console.error("Error recording call log message:", err);
  }
};

// POST /api/conversations/call/start
exports.startCall = async (req, res) => {
  try {
    const { receiverId, callType } = req.body;
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    let targetUserId = receiverId;
    let receiverUser = await User.findById(receiverId);
    let receiverProfile = await Profile.findOne({ userId: receiverId });

    if (!receiverUser) {
      // If receiverId is a Profile ID, lookup the User ID
      const profileById = await Profile.findById(receiverId);
      if (profileById?.userId) {
        targetUserId = profileById.userId;
        receiverUser = await User.findById(targetUserId);
        receiverProfile = profileById;
      }
    }

    if (!receiverProfile && targetUserId) {
      receiverProfile = await Profile.findOne({ userId: targetUserId });
    }

    const callerUser = await User.findById(req.user._id);
    const callerProfile = await Profile.findOne({ userId: req.user._id });

    const callerPhoto = callerProfile?.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400";
    const receiverPhoto = receiverProfile?.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400";

    // Cancel any previous ringing calls from this caller
    await Call.updateMany(
      { callerId: req.user._id, status: "ringing" },
      { status: "cancelled", endedAt: new Date() }
    );

    const roomID = `sathi_room_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const newCall = await Call.create({
      callerId: req.user._id,
      receiverId: targetUserId,
      callerName: callerUser?.fullName || "User",
      callerPhoto,
      receiverName: receiverUser?.fullName || "Companion",
      receiverPhoto,
      callType: callType === "audio" ? "audio" : "video",
      roomID,
      status: "ringing",
      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      call: newCall,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/conversations/call/incoming
exports.getIncomingCall = async (req, res) => {
  try {
    const threshold = new Date(Date.now() - 50 * 1000);
    const incomingCall = await Call.findOne({
      receiverId: req.user._id,
      status: "ringing",
      createdAt: { $gte: threshold },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      incomingCall: incomingCall || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/conversations/call/status/:id
exports.getCallStatus = async (req, res) => {
  try {
    const call = await Call.findById(req.params.id);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    if (call.status === "ringing" && Date.now() - new Date(call.createdAt).getTime() > 50000) {
      call.status = "missed";
      call.endedAt = new Date();
      await call.save();

      const callText = `${call.callType === "video" ? "📹 Video Call" : "📞 Audio Call"} (Missed)`;
      await recordCallMessageInConversation(call.callerId, call.receiverId, callText);
    }

    res.json({
      success: true,
      call,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/conversations/call/respond
exports.respondCall = async (req, res) => {
  try {
    const { callId, action } = req.body;
    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    if (action === "accept") {
      call.status = "accepted";
      call.startedAt = new Date();
    } else if (action === "decline") {
      call.status = "declined";
      call.endedAt = new Date();
      const callText = `${call.callType === "video" ? "📹 Video Call" : "📞 Audio Call"} (Declined)`;
      await recordCallMessageInConversation(call.callerId, call.receiverId, callText);
    } else if (action === "cancel") {
      call.status = "cancelled";
      call.endedAt = new Date();
      const callText = `${call.callType === "video" ? "📹 Video Call" : "📞 Audio Call"} (Cancelled)`;
      await recordCallMessageInConversation(call.callerId, call.receiverId, callText);
    }

    await call.save();

    res.json({
      success: true,
      call,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/conversations/call/end
exports.endCall = async (req, res) => {
  try {
    const { callId } = req.body;
    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = "ended";
    call.endedAt = new Date();
    let durationSec = 0;
    if (call.startedAt) {
      durationSec = Math.max(0, Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000));
      call.duration = durationSec;
    }
    await call.save();

    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const durStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    const callText = `${call.callType === "video" ? "📹 Video Call" : "📞 Audio Call"} (Ended • ${durStr})`;
    await recordCallMessageInConversation(call.callerId, call.receiverId, callText);

    res.json({
      success: true,
      call,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

