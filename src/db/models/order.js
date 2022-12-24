const { Sequelize, Model, DataTypes } = require('sequelize');
const { PERSON_TABLE } = require('./person');

const ORDER_TABLE = 'orders';

const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  personId: {
    field: 'person_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      key: 'id',
      model: PERSON_TABLE
    },
    onUpdate: 'CASCADE',
    // onDelete: 'SET NULL',
  },
  total: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.items.length > 0) {
        return this.items.reduce((total, item) => {
          return total + (item.price + item.OrderProduct.amount);
        }, 0);
      }

      return 0;
    }
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

class Order extends Model {
  static associate(models) {
    this.belongsTo(models.Person, { as: 'person' });
    this.belongsToMany(models.Product, {
      as: 'items',
      through: models.OrderProduct,
      foreignKey: 'orderId',
      otherKey: 'productId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: 'Order',
      timestamps: false
    }
  }
};

module.exports = {
  Order,
  OrderSchema,
  ORDER_TABLE
};