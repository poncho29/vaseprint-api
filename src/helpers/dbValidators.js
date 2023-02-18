const { User, Person, Role, Product, Category, Order } = require('../models');

// Valida si el email ya existe
const existEmail = async(email = '') => {
  const existEmail = await User.findOne({ where: { email } });

  if(existEmail) {
    throw new Error(`El correo ${email} ya esta registrado`);
  }
}

// Valida si el rol es valido
const existRole = async(id = 1) => {
  const existRole = await Role.findByPk(id);
  
  if( !existRole ) {
    throw new Error(`No existe un rol con el id ${id}`);
  }
}

const existRoles = async(roles = []) => {
  for (let i = 0; i < roles.length; i++) {
    let id = roles[i];
    const existRole = await Role.findByPk(id);
    
    if(!existRole) {
      throw new Error(`No existe un rol con el id ${id}`);
    }
  }
}

// Valida si existe un usuario
const existUserById = async (id = '') => {
  const user = await User.findByPk(id);

  if(!user) {
    throw new Error(`No existe un usuario con el id ${id}`);
  }
}

// Valida si existe un producto
const existProductById = async (id = '') => {
  const producto = await Product.findByPk(id);

  if (!producto) {
    throw new Error(`No existe un producto con el id ${id}`)
  }
}

// Valida si existe una categoria
const existCategoryById = async (id = 1) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new Error(`No existe una categoria con el id ${id}`)
  }
}

// Valida si existe un producto
const existOrderById = async (id = '') => {
  const order = await Order.findByPk(id);

  if (!order) {
    throw new Error(`No existe una orden con el id ${id}`)
  }
}

// Valida si existe la coleccion(tabla)
const collectionsAllowed = (collection = '', collections = []) => {
  const existCollection = collections.includes(collection);

  if(!existCollection) {
    throw new Error(`La colección ${collection} no es permitida`);
  }

  return true;
}

module.exports = {
  existUserById,
  existEmail,
  existRole,
  existRoles,
  existProductById,
  existCategoryById,
  existOrderById,
  collectionsAllowed
}