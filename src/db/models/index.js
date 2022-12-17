const { User, UserSchema } = require('./user');
const { Role, RoleSchema } = require('./role');
const { Person, PersonSchema } = require('./person');
const { UserRole, UserRoleSchema } = require('./user-role');
const { Order, OrderSchema } = require('./order');
const { Product, ProductSchema } = require('./product');
const { Category, CategorySchema } = require('./category');

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Role.init(RoleSchema, Role.config(sequelize));
  Person.init(PersonSchema, Person.config(sequelize));
  UserRole.init(UserRoleSchema, UserRole.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));

  // Ejecuta las asociaciones
  User.associate(sequelize.models);
  Person.associate(sequelize.models);
  Order.associate(sequelize.models);
  Product.associate(sequelize.models);
  Category.associate(sequelize.models);
}

module.exports = {
  User, 
  Role,
  Person,
  Order,
  Product,
  Category,
  setupModels
};