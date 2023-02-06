const { User, UserSchema } = require('./user');
const { Role, RoleSchema } = require('./role');
// const { Person, PersonSchema } = require('./person');
const { Order, OrderSchema } = require('./order');
const { Product, ProductSchema } = require('./product');
const { Category, CategorySchema } = require('./category');
const { OrderProduct, OrderProductSchema } = require('./order-product');

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Role.init(RoleSchema, Role.config(sequelize));
  // Person.init(PersonSchema, Person.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  OrderProduct.init(OrderProductSchema, OrderProduct.config(sequelize));

  // Ejecuta las asociaciones
  User.associate(sequelize.models);
  // Person.associate(sequelize.models);
  Order.associate(sequelize.models);
  Product.associate(sequelize.models);
  Category.associate(sequelize.models);
}

module.exports = {
  User, 
  Role,
  // Person,
  Order,
  Product,
  Category,
  OrderProduct,
  setupModels
};