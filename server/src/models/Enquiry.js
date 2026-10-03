const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  message:   { type: String, required: true },
  status:    { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new' },
  notes:     { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Enquiry', enquirySchema);