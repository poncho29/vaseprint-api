const { Order, OrderProduct } = require('../models');

const getOrder = async (req, res) => {
  const { id } = req.params;
  
  try {
    const order = await Order.findByPk(id, {
      include: [
        {
          association: 'user',
          // include: ['user']
        },
        'items'
      ]
    });

    res.status(201).json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

const getOrders = async (req, res) => {
  const { limit = 5, offset = 0 } = req.query;

  try {
    const [count, orders] = await Promise.all([
      Order.count(),
      Order.findAll({
        limit: Number(limit),
        offset: Number(offset)
      })
    ]);

    res.status(200).json({
      count,
      orders
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);

    res.status(201).json({
      msg: 'New order created successfully',
      newOrder
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

const addItem = async (req, res) => {
  try {
    const newItem = await OrderProduct.create(req.body);

    res.status(201).json({
      msg: 'New item added',
      newItem
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

module.exports = {
  getOrder,
  getOrders,
  createOrder,
  addItem
}