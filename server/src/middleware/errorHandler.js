const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate field value entered' });
  }

  return res.status(500).json({ success: false, message: err.message || 'Server Error' });
};

module.exports = errorHandler;
