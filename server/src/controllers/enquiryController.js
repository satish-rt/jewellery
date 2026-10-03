const Enquiry = require('../models/Enquiry');
const Product = require('../models/Product');
const { sendEnquiryNotification } = require('../utils/mailer');
const mongoose = require('mongoose');

const submitEnquiry = async (req, res, next) => {
  try {
    const { _honey, name, phone, email, message, productId } = req.body;
    if (_honey) return res.status(200).json({ success: true });

    let productName = null;
    if (productId) {
      if (!mongoose.isValidObjectId(productId)) return res.status(400).json({ success: false, message: 'Invalid product ID' });
      const product = await Product.findById(productId);
      if (!product) return res.status(400).json({ success: false, message: 'Product not found' });
      productName = product.name;
    }

    const enquiry = await Enquiry.create({ name, phone, email, message, productId: productId || undefined });

    // Send email notification (silently fails if email not configured)
    try { await sendEnquiryNotification({ name, phone, email, message, productName }); }
    catch (e) { console.error('Email notification failed (configure EMAIL_USER/EMAIL_PASS in .env):', e.message); }

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully' });
  } catch (err) { next(err); }
};

const getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).populate('productId', 'name images');
    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (err) { next(err); }
};

const updateEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ success: false, message: 'Not found' });
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Not found' });
    if (status && ['new', 'contacted', 'resolved'].includes(status)) enquiry.status = status;
    if (notes !== undefined) enquiry.notes = notes;
    await enquiry.save();
    res.json({ success: true, enquiry });
  } catch (err) { next(err); }
};

// CSV export for enquiries
const exportEnquiriesCSV = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).populate('productId', 'name');
    const header = 'Date,Name,Email,Phone,Product,Message,Status,Notes';
    const rows = enquiries.map(e => [
      new Date(e.createdAt).toLocaleDateString('en-IN'),
      `"${e.name}"`, `"${e.email}"`, `"${e.phone}"`,
      `"${e.productId?.name || 'General'}"`,
      `"${(e.message || '').replace(/"/g, "'")}"`,
      e.status,
      `"${(e.notes || '').replace(/"/g, "'")}"`
    ].join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="rajlaxmi-enquiries.csv"');
    res.send(header + '\n' + rows);
  } catch (err) { next(err); }
};

module.exports = { submitEnquiry, getEnquiries, updateEnquiry, exportEnquiriesCSV };