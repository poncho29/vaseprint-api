const { Router } = require("express");
const { param } = require('express-validator');

const { validFields, validFile } = require('../middlewares');
const { collectionsAllowed, existUserById } = require("../helpers");
const { uploadFile, updateImageCloudinary, getImage } = require("../controllers/uploads");

const router = Router();

router.post('/', validFile, uploadFile);

router.put('/:collection/:id', [
  validFile,
  param('id').custom(existUserById),
  param('collection').custom(c => collectionsAllowed(c, ['users', 'products'])),
  validFields
], updateImageCloudinary);
// ], updateImage);

router.get('/:collection/:id', [
  param('id').custom(existUserById),
  param('collection').custom(c => collectionsAllowed(c, ['users', 'products'])),
  validFields
], getImage);

module.exports = router;