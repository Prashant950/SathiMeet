const mongoose = require("mongoose");

const callSchema = new mongoose.Schema(
  {
    callerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    callerName: {
      type: String,
      default: "User",
    },
    callerPhoto: {
      type: String,
      default: "",
    },
    receiverName: {
      type: String,
      default: "User",
    },
    receiverPhoto: {
      type: String,
      default: "",
    },
    callType: {
      type: String,
      enum: ["video", "audio"],
      default: "video",
    },
    roomID: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ringing", "accepted", "declined", "cancelled", "ended", "missed"],
      default: "ringing",
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto expire inactive calls after 24 hours
callSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Call", callSchema);
