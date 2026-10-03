const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, deleteProductImage } = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const { validateProduct, handleValidationErrors } = require('../middleware/validate');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post(
  '/',
  authMiddleware,
  upload.array('images', 10),
  validateProduct,
  handleValidationErrors,
  createProduct
);

router.put(
  '/:id',
  authMiddleware,
  upload.array('images', 10),
  updateProduct
);

// Replace a single image on a product
router.patch('/:id/images/:imageId', authMiddleware, upload.single('image'), require('../controllers/productController').replaceProductImage);

router.delete('/:id', authMiddleware, deleteProduct);
// Delete a single image from a product (body: { publicId, url })
router.delete('/:id/images', authMiddleware, deleteProductImage);

module.exports = router;
