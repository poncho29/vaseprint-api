const { Sequelize, Model, DataTypes } = require('sequelize');
const { USER_TABLE } = require('./user');

const PERSON_TABLE = 'persons';

const PersonSchema = {
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
  dni: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  img: {
    type: DataTypes.STRING
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
  userId: {
    allowNull: false,
    field: 'user_id',
    type: DataTypes.INTEGER,    
    references: {
      key: 'id',
      model: USER_TABLE,
    },
    onUpdate: 'CASCADE',
    // onDelete: 'SET NULL',
  },  
};

class Person extends Model {
  static associate(models) {
    this.belongsTo(models.User, { as: 'user' });
    this.hasMany(models.Order, {
      as: 'orders',
      foreignKey: 'personId'
    })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PERSON_TABLE,
      modelName: 'Person',
      timestamps: false
    }
  }
};

module.exports = {
  Person,
  PersonSchema,
  PERSON_TABLE
};