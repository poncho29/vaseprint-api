const { Sequelize, Model, DataTypes } = require('sequelize');
const { ROLE_TABLE } = require('./role');
const { USER_TABLE } = require('./user');

const USER_ROLE_TABLE = 'user_role';

const UserRoleSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    allowNull: false,
    field: 'user_id',
    type: DataTypes.INTEGER,    
    references: {
      key: 'id',
      model: USER_TABLE ,
    },
    onUpdate: 'CASCADE',
    // onDelete: 'SET NULL',
  },
  roleId: {
    allowNull: false,
    field: 'role_id',
    type: DataTypes.INTEGER,    
    references: {
      key: 'id',
      model: ROLE_TABLE,
    },
    onUpdate: 'CASCADE',
    // onDelete: 'SET NULL',
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

class UserRole extends Model {
  static associate() {
    // associate
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_ROLE_TABLE,
      modelName: 'UserRole',
      timestamps: false
    }
  }
};

module.exports = {
  UserRole,
  UserRoleSchema,
  USER_ROLE_TABLE
};