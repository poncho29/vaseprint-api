const { Router } = require('express');
const { body, param } = require('express-validator');

const { getProduct,
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct } = require('../controllers/products');

const { existProductById, existCategoryById } = require('../helpers');
const { validFields, validJwt, validRole } = require('../middlewares');

const router = Router();

// Public
router.get('/', getProducts);

// Public
router.get('/:id', [
  param('id').custom(existProductById),
  validFields
], getProduct);

// Private - only an admin can create
router.post('/', [
  validJwt,
  validRole,
  body('name', 'Product name is required').not().isEmpty(),
  body('price', 'Product price is required').not().isEmpty(),
  body('quantity', 'Product quantity is required').not().isEmpty(),
  body('categoryId').custom(existCategoryById),
  validFields
], createProduct);

// Private - only an admin can update
router.put('/:id', [
  validJwt,
  validRole,
  param('id').custom(existProductById),
  validFields
], updateProduct);

// Private - only an admin can delete
router.delete('/:id', [
  validJwt,
  validRole,
  param('id').custom(existProductById),
  validFields
], deleteProduct);

module.exports = router;