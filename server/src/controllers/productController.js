const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const mongoose = require('mongoose');

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getProducts = async (req, res, next) => {
  try {
    const { category, q, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category && ['gold', 'silver'].includes(category)) {
      filter.category = category;
    }

    if (q && q.trim()) {
      filter.name = { $regex: escapeRegex(q.trim()), $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        const parsedMin = Number(minPrice);
        if (!Number.isNaN(parsedMin)) filter.price.$gte = parsedMin;
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        const parsedMax = Number(maxPrice);
        if (!Number.isNaN(parsedMax)) filter.price.$lte = parsedMax;
      }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('UPDATE PRODUCT called for id', id, 'files present?', req.files && req.files.length);
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, weight, purity, description, inStock } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'lumiere/products', file.mimetype)
      );
      images = await Promise.all(uploadPromises);
    }

    // If no images were uploaded, supply a high-quality default piece image
    if (!images || images.length === 0) {
      const defaultImg =
        category === 'silver'
          ? 'https://images.unsplash.com/photo-1611591475879-11c9118c7c97?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
      images = [{ url: defaultImg, publicId: null }];
    }

    const product = new Product({
      name: name ? name.trim() : 'Jewellery Item',
      category: category || 'gold',
      price: Number(price) || 0,
      weight: weight && weight.trim() ? weight.trim() : 'Standard',
      purity: purity && purity.trim() ? purity.trim() : (category === 'silver' ? '925 Silver' : '22K Gold'),
      description: description && description.trim() ? description.trim() : `${name || 'Jewellery piece'} - Handcrafted with precision.`,
      inStock: inStock === 'false' ? false : true,
      images,
    });

    await product.save();

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, category, price, weight, purity, description, inStock } = req.body;
    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = price;
    if (weight) product.weight = weight;
    if (purity) product.purity = purity;
    if (description) product.description = description;
    if (inStock !== undefined) product.inStock = inStock === 'false' ? false : true;

    if (req.files && req.files.length > 0) {
      // If new files are uploaded while editing, replace existing images with the new uploads.
      // First, remove any existing cloud images.
      const existingPublicIds = product.images.map(i => i.publicId).filter(Boolean);
      if (existingPublicIds.length > 0) {
        const deletePromises = existingPublicIds.map(pid => deleteFromCloudinary(pid));
        await Promise.all(deletePromises);
      }

      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'lumiere/products', file.mimetype)
      );
      const newImages = await Promise.all(uploadPromises);
      product.images = newImages;
    }

    await product.save();

    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const deletePromises = product.images.map((img) => deleteFromCloudinary(img.publicId));
    await Promise.all(deletePromises);

    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

const deleteProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Accept publicId/url from body or query (some clients drop DELETE body)
    const { publicId, url } = Object.assign({}, req.body || {}, req.query || {});

    console.log('DELETE IMAGE request for product', id, 'body:', { publicId, url });

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Remove locally-referenced images (matching url) or cloud images by publicId
    const beforeCount = product.images.length;
    console.log('Existing images before:', product.images);
    product.images = product.images.filter((img) => {
      if (publicId && img.publicId) return img.publicId !== publicId;
      if (url) return img.url !== url;
      // if neither provided, keep all
      return true;
    });
    console.log('Images after filter:', product.images);

    // Ensure product has at least one image (schema validation). If deletion leaves none,
    // fall back to a placeholder image so save does not fail.
    if (!product.images || product.images.length === 0) {
      product.images = [{ url: 'https://placehold.co/800x800/000000/FFFFFF?text=No+Image' }];
      console.log('No images left - set placeholder image');
    }

    // If publicId provided, also delete from Cloudinary
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    await product.save();

    return res.status(200).json({ success: true, product, removed: beforeCount - product.images.length });
  } catch (err) {
    next(err);
  }
};

const replaceProductImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(imageId)) {
      return res.status(404).json({ success: false, message: 'Product or image not found' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const imgIndex = product.images.findIndex((img) => String(img._id) === String(imageId));
    if (imgIndex === -1) {
      return res.status(404).json({ success: false, message: 'Image not found on product' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    // Upload new image
    const uploaded = await uploadToCloudinary(req.file.buffer, 'lumiere/products', req.file.mimetype);

    // Delete old cloud image if present
    const old = product.images[imgIndex];
    if (old && old.publicId) {
      await deleteFromCloudinary(old.publicId);
    }

    product.images[imgIndex] = uploaded;
    await product.save();

    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  replaceProductImage,
};
