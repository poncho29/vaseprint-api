const { Sequelize, Model, DataTypes } = require('sequelize');
const { ROLE_TABLE } = require('./role');

const USER_TABLE = 'users';

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: 1
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

class User extends Model {
  static associate(models) {
    this.hasOne(models.Person, {
      as: 'person',
      foreignKey: 'userId'
    });
    this.belongsTo(models.Role, {
      as: 'role'
    });
    // this.belongsToMany(models.Role, {
    //   as: 'roles',
    //   through: models.UserRole,
    //   foreignKey: 'userId',
    //   otherKey: 'roleId'
    // });
  };

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  };
};

module.exports = {
  User,
  UserSchema,
  USER_TABLE
}