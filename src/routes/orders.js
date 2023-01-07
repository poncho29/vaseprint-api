const { Router } = require('express');
const { body, param } = require('express-validator');

const { getOrder,
        getOrders,
        createOrder,
        addItem } = require('../controllers/order');


const { validFields, validJwt } = require('../middlewares');
const { existOrderById, existPersonById, existProductById } = require('../helpers');

const router = Router();

// Public
router.get('/', getOrders);

// Public
router.get('/:id', [
  param('id').custom(existOrderById),
  validFields
], getOrder);

// Public
router.post('/', [
  validJwt,
  body('personId').custom(existPersonById),
  validFields
], createOrder);

// Public
router.post('/add-item', [
  validJwt,
  body('orderId').custom(existOrderById),
  body('productId').custom(existProductById),
  body('amount', 'The amount in required').not().isEmpty(),
  validFields
], addItem);

module.exports = router;