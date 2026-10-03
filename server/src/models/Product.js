const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['gold', 'silver'],
    required: true,
  },
  images: {
    type: [
      {
        url: String,
        publicId: String,
      },
    ],
    validate: [
      (val) => val.length >= 1,
      '{PATH} requires at least one image',
    ],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  weight: {
    type: String,
    required: true,
  },
  purity: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
