const { Sequelize, Model, DataTypes } = require('sequelize');

const { ORDER_TABLE } = require('./order');
const { PRODUCT_TABLE } = require('./product');

const ORDER_PRODUCT_TABLE = 'orders_products';

const OrderProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  orderId: {
    allowNull: false,
    field: 'order_id',
    type: DataTypes.INTEGER,    
    references: {
      key: 'id',
      model: ORDER_TABLE,
    },
    onUpdate: 'CASCADE',
    // onDelete: 'SET NULL',
  },
  productId: {
    allowNull: false,
    field: 'product_id',
    type: DataTypes.INTEGER,    
    references: {
      key: 'id',
      model: PRODUCT_TABLE,
    },
    onUpdate: 'CASCADE',
    // onDelete: 'SET NULL',
  },
  amount: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
};

class OrderProduct extends Model {
  static associate() {
    // associate
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_PRODUCT_TABLE,
      modelName: 'OrderProduct',
      timestamps: false
    }
  }
};

module.exports = {
  OrderProduct,
  OrderProductSchema,
  ORDER_PRODUCT_TABLE
};