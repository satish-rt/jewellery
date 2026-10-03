const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configured later in index.js via dotenv, but can be done here as well:
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const uploadToCloudinary = (fileBuffer, folder) => {
  // If Cloudinary credentials are not configured, fall back to writing the image
  // to the Vite client's public/images folder so it can be served as a static asset.
  if (
    !process.env.CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY === "placeholder"
  ) {
    const fs = require("fs");
    const path = require("path");
    // Resolve from project root: go up from server/src/utils → server → project root → client
    const projectRoot = path.resolve(__dirname, "..", "..", "..", "client");
    const imagesDir = path.join(projectRoot, "public", "images");
    try {
      if (!fs.existsSync(imagesDir))
        fs.mkdirSync(imagesDir, { recursive: true });
      const filename = `dev-${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
      const filePath = path.join(imagesDir, filename);
      fs.writeFileSync(filePath, fileBuffer);
      console.log(`[Dev] Image saved to: ${filePath}`);
      return Promise.resolve({ url: `/images/${filename}`, publicId: null });
    } catch (err) {
      console.error("[Dev] Failed to save image:", err);
      return Promise.reject(err);
    }
  }
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Error deleting image from cloudinary: ${publicId}`, error);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
