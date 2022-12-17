const { Sequelize } = require('sequelize');

const { setupModels } = require('./models');

const USER_DB = process.env.USER_DB;
const PASSWORD_DB = process.env.PASSWORD_DB;
const NAME_DB = process.env.NAME_DB;

const sequelize = new Sequelize(NAME_DB, USER_DB, PASSWORD_DB, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

// Se le envia la conexion, no es lo mas recomendado en produccion
setupModels(sequelize);

// Hace la sync y crea los modelos en la DB
sequelize.sync();

module.exports = sequelize;