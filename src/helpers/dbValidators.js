const { User, Person, Role, Product, Category, Order } = require('../db/models');

// Valida si el email ya existe
const existEmail = async(email = '') => {
  const existEmail = await User.findOne({ where: { email } });

  if(existEmail) {
    throw new Error(`The email ${email} is already registered`);
  }
}

// Valida si el rol es valido
// const existRole = async(role = '') => {
const existRole = async(id = 1) => {
  const existRole = await Role.findByPk(id);
  
  if( !existRole ) {
    throw new Error(`There is no role with id ${id}`);
  }
}

const existRoles = async(roles = []) => {
  for (let i = 0; i < roles.length; i++) {
    let id = roles[i];
    const existRole = await Role.findByPk(id);
    console.log(existRole)
    
    if(!existRole) {
      throw new Error(`There is no role with id ${id}`);
    }
  }
}

// Valida si existe una persona
const existPersonById = async (id = '') => {
  const person = await Person.findByPk(id);

  if(!person) {
    throw new Error(`There is no person with id ${id}`);
  }
}

// Valida si existe un usuario
const existUserById = async (id = '') => {
  const user = await User.findByPk(id);

  if(!user) {
    throw new Error(`There is no user with id ${id}`);
  }
}

// Valida si existe un producto
const existProductById = async (id = '') => {
  const producto = await Product.findByPk(id);

  if (!producto) {
    throw new Error(`There is no product with id ${id}`)
  }
}

// Valida si existe una categoria
const existCategoryById = async (id = 1) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error(`There is no category with id ${id}`)
  }
}

// Valida si existe un producto
const existOrderById = async (id = '') => {
  const order = await Order.findByPk(id);

  if (!order) {
    throw new Error(`There is no order with id ${id}`)
  }
}

module.exports = {
  existPersonById,
  existUserById,
  existEmail,
  existRole,
  existRoles,
  existProductById,
  existCategoryById,
  existOrderById
}