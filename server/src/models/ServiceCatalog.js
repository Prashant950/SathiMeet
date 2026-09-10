const mongoose = require("mongoose");

const serviceCatalogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    category: {
      type: String,
      default: "social",
    },
    rate: { type: Number, required: true },
    durationUnit: {
      type: String,
      default: "session",
    },
    description: { type: String, trim: true },
    tag: { type: String, default: "Popular" },
    rating: { type: Number, default: 4.9 },
    color: { type: String, default: "from-violet-600 to-indigo-500" },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceCatalog", serviceCatalogSchema);