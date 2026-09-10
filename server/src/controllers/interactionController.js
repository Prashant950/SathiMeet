const Interaction = require("../models/Interaction");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Profile = require("../models/Profile");

const createMatchConversation = async (userA, userB) => {
  const sorted = [userA.toString(), userB.toString()].sort();
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

  return conv;
};

// POST /api/interactions/swipe
exports.swipe = async (req, res) => {
  try {
    const { targetUserId, action } = req.body;
    const userId = req.user._id;

    if (!targetUserId || !action) {
      return res.status(400).json({ message: "targetUserId and action required" });
    }

    if (userId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: "Cannot swipe on yourself" });
    }

    const interaction = await Interaction.findOneAndUpdate(
      { userId, targetUserId },
      { action, status: action === "pass" ? "rejected" : "pending" },
      { upsert: true, new: true }
    );

    let matched = false;
    let matchUser = null;
    let conversationId = null;

    if (action === "like" || action === "superlike") {
      const reverse = await Interaction.findOne({
        userId: targetUserId,
        targetUserId: userId,
        action: { $in: ["like", "superlike"] },
      });

      if (reverse) {
        interaction.status = "matched";
        reverse.status = "matched";
        await interaction.save();
        await reverse.save();
        const conv = await createMatchConversation(userId, targetUserId);
        matched = true;
        conversationId = conv._id;

        const targetUserObj = await User.findById(targetUserId).select("fullName email");
        const targetProfile = await Profile.findOne({ userId: targetUserId });
        matchUser = {
          userId: targetUserId,
          name: targetUserObj?.fullName || "Match",
          photo: targetProfile?.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
        };
      }
    }

    res.json({
      message: matched ? "It's a match! 🎉" : "Swipe recorded",
      matched,
      matchUser,
      conversationId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/interactions/like-back
exports.likeBack = async (req, res) => {
  try {
    const { interactionId, targetUserId } = req.body;
    const userId = req.user._id;

    let targetId = targetUserId;

    if (interactionId) {
      const interaction = await Interaction.findById(interactionId);
      if (interaction) {
        interaction.status = "matched";
        await interaction.save();
        targetId = interaction.userId;
      }
    }

    if (!targetId) {
      return res.status(400).json({ message: "targetUserId or interactionId required" });
    }

    // Set reciprocal interaction to matched
    await Interaction.findOneAndUpdate(
      { userId, targetUserId: targetId },
      { action: "like", status: "matched" },
      { upsert: true, new: true }
    );

    // Also update reverse
    await Interaction.findOneAndUpdate(
      { userId: targetId, targetUserId: userId },
      { status: "matched" }
    );

    const conv = await createMatchConversation(userId, targetId);

    const targetUserObj = await User.findById(targetId).select("fullName email");
    const targetProfile = await Profile.findOne({ userId: targetId });

    res.json({
      message: "Matched! 💖",
      matched: true,
      conversationId: conv._id,
      matchUser: {
        userId: targetId,
        name: targetUserObj?.fullName || "Match",
        photo: targetProfile?.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
