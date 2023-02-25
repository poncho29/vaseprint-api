const { Router } = require("express");
const { param, body } = require('express-validator');

const { validFields, validFile } = require('../middlewares');
const { collectionsAllowed, existUserById } = require("../helpers");
const {
  getImage,
  uploadImageCloudinary,
  updateImageCloudinary,
  deleteImageCloudinary
} = require("../controllers/uploads");

const router = Router();

router.post('/', validFile, uploadImageCloudinary);

router.put('/:collection/:id', [
  validFile,
  param('id').custom(existUserById),
  // param('collection').custom(c => collectionsAllowed(c, ['users', 'products'])),
  validFields
], updateImageCloudinary);
// ], updateImage);

router.get('/:collection/:id', [
  param('id').custom(existUserById),
  param('collection').custom(c => collectionsAllowed(c, ['users', 'products'])),
  validFields
], getImage);

router.delete('/:id', deleteImageCloudinary);

module.exports = router;