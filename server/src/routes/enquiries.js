const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitEnquiry, getEnquiries, updateEnquiry, exportEnquiriesCSV } = require('../controllers/enquiryController');
const { validateEnquiry, handleValidationErrors } = require('../middleware/validate');

router.post('/', validateEnquiry, handleValidationErrors, submitEnquiry);
router.get('/', auth, getEnquiries);
router.put('/:id', auth, updateEnquiry);
router.patch('/:id', auth, updateEnquiry);
router.get('/export/csv', auth, exportEnquiriesCSV);

module.exports = router;