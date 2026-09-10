const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["pass", "like", "superlike"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "matched", "rejected"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

interactionSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });
interactionSchema.index({ targetUserId: 1, status: 1, action: 1 });

module.exports = mongoose.model("Interaction", interactionSchema);
