const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Interaction = require("../models/Interaction");

// One-time cleanup for any legacy dummy @sathimeet.com seed users
const cleanLegacyDummyUsers = async () => {
  try {
    const dummyUsers = await User.find({ email: /@sathimeet\.com$/ });
    if (dummyUsers.length > 0) {
      const dummyIds = dummyUsers.map((u) => u._id);
      await Profile.deleteMany({ userId: { $in: dummyIds } });
      await Interaction.deleteMany({
        $or: [{ userId: { $in: dummyIds } }, { targetUserId: { $in: dummyIds } }],
      });
      await User.deleteMany({ _id: { $in: dummyIds } });
    }
  } catch (err) {
    // Ignore cleanup error
  }
};

const formatProfileObj = (profile, user) => {
  const photos = profile?.photos && profile.photos.length > 0
    ? profile.photos
    : ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"];

  return {
    _id: profile?._id || user._id,
    id: profile?._id || user._id,
    userId: user._id,
    name: user.fullName || "Companion",
    fullName: user.fullName || "Companion",
    email: user.email || "",
    contactNumber: user.contactNumber || "",
    age: profile?.age || 24,
    gender: profile?.gender || "Not specified",
    height: profile?.height || "",
    weight: profile?.weight || "",
    city: profile?.location?.city || profile?.city || "India",
    state: profile?.location?.state || "",
    country: profile?.location?.country || "India",
    address: profile?.location?.address || "",
    location: profile?.location || { city: profile?.city || "India" },
    photo: photos[0],
    photos: photos,
    tags: profile?.interests || ["Travel", "Coffee", "Music"],
    interests: profile?.interests || ["Travel", "Coffee", "Music"],
    job: profile?.jobTitle || "Verified Member",
    jobTitle: profile?.jobTitle || "Verified Member",
    company: profile?.company || "",
    educationLevel: profile?.educationLevel || "",
    university: profile?.university || "",
    education: [profile?.educationLevel, profile?.university].filter(Boolean).join(", ") || "",
    lookingFor: profile?.lookingFor || [],
    lifestyle: profile?.lifestyle || {
      drinking: "",
      smoking: "",
      workout: "",
      diet: "",
      pets: "",
    },
    bio: profile?.bio || "Looking to make genuine and meaningful connections on Sathi Meet.",
    verified: true,
    isOnline: profile?.isOnline !== false,
  };
};

// GET /api/profiles/discovery (100% Real Users only)
exports.getDiscovery = async (req, res) => {
  try {
    await cleanLegacyDummyUsers();
    const userId = req.user._id;

    // Users already swiped by current user
    const swiped = await Interaction.find({ userId }).select("targetUserId");
    const swipedIds = swiped.map((i) => i.targetUserId);
    swipedIds.push(userId);

    const query = {
      userId: { $nin: swipedIds },
    };

    let profiles = await Profile.find(query)
      .populate({
        path: "userId",
        select: "fullName email contactNumber isBlocked isProfileCompleted",
        match: { isBlocked: { $ne: true } },
      })
      .sort({ updatedAt: -1 })
      .limit(50);

    // Filter out: current user, deleted users, blocked users, or any dummy test email accounts
    profiles = profiles.filter(
      (p) =>
        p.userId &&
        p.userId._id &&
        p.userId._id.toString() !== userId.toString() &&
        !p.userId.email?.endsWith("@sathimeet.com")
    );

    const formatted = profiles.map((p) => formatProfileObj(p, p.userId));

    res.json({ profiles: formatted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/profiles/matches (100% Real Likes & Matches)
exports.getMatches = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Real pending likes received by current user
    const likesMeRaw = await Interaction.find({
      targetUserId: userId,
      action: { $in: ["like", "superlike"] },
      status: "pending",
    }).sort({ createdAt: -1 });

    const likesMe = [];
    for (const item of likesMeRaw) {
      const senderUser = await User.findById(item.userId).select("fullName email contactNumber isBlocked");
      if (!senderUser || senderUser.isBlocked || senderUser.email?.endsWith("@sathimeet.com")) continue;
      const senderProfile = await Profile.findOne({ userId: item.userId });

      const formatted = formatProfileObj(senderProfile, senderUser);
      likesMe.push({
        _id: item._id,
        interactionId: item._id,
        senderUserId: item.userId,
        action: item.action,
        time: "Recently",
        reason: item.action === "superlike" ? "Sent a Super Like ⭐" : "Liked your profile",
        ...formatted,
      });
    }

    // 2. Real mutual matches
    const mutualRaw = await Interaction.find({
      status: "matched",
      $or: [{ userId }, { targetUserId: userId }],
    }).sort({ updatedAt: -1 });

    const seenOtherIds = new Set();
    const mutualMatches = [];

    for (const item of mutualRaw) {
      const otherId = item.userId.toString() === userId.toString()
        ? item.targetUserId.toString()
        : item.userId.toString();

      if (seenOtherIds.has(otherId)) continue;
      seenOtherIds.add(otherId);

      const otherUser = await User.findById(otherId).select("fullName email contactNumber isBlocked");
      if (!otherUser || otherUser.isBlocked || otherUser.email?.endsWith("@sathimeet.com")) continue;
      const otherProfile = await Profile.findOne({ userId: otherId });

      const formatted = formatProfileObj(otherProfile, otherUser);
      mutualMatches.push({
        _id: item._id,
        interactionId: item._id,
        otherUserId: otherId,
        time: "Just now",
        lastMessage: "Say hello to your new match! 👋",
        hasUnread: false,
        ...formatted,
      });
    }

    res.json({
      likesMe,
      mutualMatches,
      likesCount: likesMe.length,
      matchesCount: mutualMatches.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
