const cloudinary = require("../config/cloudinary");

// POST /api/upload/image
exports.uploadImage = async (req, res) => {
  try {
    const { image, images } = req.body;

    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "sathi_meet/profiles",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      return res.json({
        success: true,
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      });
    }

    if (Array.isArray(images) && images.length > 0) {
      const uploadPromises = images.map((img) =>
        cloudinary.uploader.upload(img, {
          folder: "sathi_meet/profiles",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        })
      );

      const results = await Promise.all(uploadPromises);
      const urls = results.map((r) => r.secure_url);

      return res.json({
        success: true,
        urls,
        count: urls.length,
      });
    }

    return res.status(400).json({ message: "No image or images payload provided" });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to upload image to Cloudinary",
    });
  }
};
