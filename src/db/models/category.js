const { Sequelize, Model, DataTypes } = require('sequelize');

const CATEGORY_TABLE = 'categories';

const CategorySchema = {
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
  }
};

class Category extends Model {
  static associate(models) {
    this.hasMany(models.Product, {
      as: 'products',
      foreignKey: 'categoryId'
    });
  };

  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_TABLE,
      modelName: 'Category',
      timestamps: false
    }
  };
};

module.exports = {
  Category,
  CategorySchema,
  CATEGORY_TABLE
}