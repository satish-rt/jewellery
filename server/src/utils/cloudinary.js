const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const uploadToCloudinary = async (fileBuffer, folder = 'lumiere/products', mimetype = 'image/jpeg') => {
  // Ensure Cloudinary is configured with current environment variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const hasCredentials =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'placeholder' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'placeholder' &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== 'placeholder';

  if (!hasCredentials) {
    console.warn('[Cloudinary] Credentials not configured or placeholder. Using Data URI fallback.');
    const base64 = fileBuffer.toString('base64');
    return {
      url: `data:${mimetype || 'image/jpeg'};base64,${base64}`,
      publicId: null,
    };
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, res) => {
          if (error) return reject(error);
          resolve(res);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('[Cloudinary upload failed]:', error.message || error);
    // Graceful fallback: convert to Data URI so product creation NEVER fails
    console.warn('[Cloudinary] Falling back to Data URI for product image.');
    const base64 = fileBuffer.toString('base64');
    return {
      url: `data:${mimetype || 'image/jpeg'};base64,${base64}`,
      publicId: null,
    };
  }
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Error deleting image from cloudinary: ${publicId}`, error);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};

