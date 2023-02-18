const { Router } = require('express');
const { body, param } = require('express-validator');

const { getCategory,
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory } = require('../controllers/categories');

const { existCategoryById } = require('../helpers');
const { validFields, validJwt, validRole } = require('../middlewares');

const router = Router();

// Public
router.get('/', getCategories);

// Public
router.get('/:id', [
  param('id').custom(existCategoryById),
  validFields
], getCategory);

// Private - only an admin can create
router.post('/', [
  validJwt,
  validRole,
  body('name', 'El nombre de la categoria es requerida').not().isEmpty(),
  validFields
], createCategory);

// Private - only an admin can update
router.put('/:id', [
  validJwt,
  validRole,
  param('id').custom(existCategoryById),
  validFields
], updateCategory);

// Private - only an admin can delete
router.delete('/:id', [
  validJwt,
  validRole,
  param('id').custom(existCategoryById),
  validFields
], deleteCategory);

module.exports = router;