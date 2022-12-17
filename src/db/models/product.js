const { Sequelize, Model, DataTypes } = require('sequelize');
const { CATEGORY_TABLE } = require('./category');

const PRODUCT_TABLE = 'products';

// Define la estructura de la base de datos
const ProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  price: {
    allowNull: false,
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  quantity: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  description: {
    type: DataTypes.STRING,
  },
  img: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: 1,
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
  },
  categoryId: {
    allowNull: false,
    field: 'category_id',
    type: DataTypes.INTEGER,
    references: {
      key: 'id',
      model: CATEGORY_TABLE
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
}

class Product extends Model {
  static associate(models) {
    // Obtener desde el producto la categoria
    this.belongsTo(models.Category, {
      as: 'category'
    });
  };

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_TABLE,
      modelName: 'Product',
      timestamps: false
    }
  };
};

module.exports = {
  Product,
  ProductSchema,
  PRODUCT_TABLE
}