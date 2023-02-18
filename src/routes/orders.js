const { Router } = require('express');
const { body, param } = require('express-validator');

const { getOrder,
        getOrders,
        createOrder,
        addItem } = require('../controllers/order');


const { validFields, validJwt } = require('../middlewares');
const { existOrderById, existProductById, existUserById } = require('../helpers');

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
  body('userId').custom(existUserById),
  validFields
], createOrder);

// Public
router.post('/add-item', [
  validJwt,
  body('orderId').custom(existOrderById),
  body('productId').custom(existProductById),
  body('amount', 'La cantidad es requerida').not().isEmpty(),
  validFields
], addItem);

module.exports = router;