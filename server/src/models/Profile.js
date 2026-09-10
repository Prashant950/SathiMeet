const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    age: { type: Number, required: true, min: 18 },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    interests: [{ type: String }],
    height: String,
    weight: String,
    lookingFor: [{ type: String }],
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 99 },
    },
    lifestyle: {
      drinking: String,
      smoking: String,
      workout: String,
      diet: String,
      pets: String,
    },
    photos: [{ type: String }],
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
      city: String,
      state: String,
      country: String,
      address: String,
    },
    bio: String,
    jobTitle: String,
    company: String,
    educationLevel: String,
    university: String,
    isOnline: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Geospatial index for $near discovery queries
profileSchema.index({ location: "2dsphere" });
profileSchema.index({ gender: 1 });

module.exports = mongoose.model("Profile", profileSchema);
