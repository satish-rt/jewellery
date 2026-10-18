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
    default: [],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  weight: {
    type: String,
    default: 'Standard',
  },
  purity: {
    type: String,
    default: 'Standard',
  },
  description: {
    type: String,
    default: '',
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
