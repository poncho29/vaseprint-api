// const PORT_DB = process.env.PORT;
const NAME_DB = process.env.NAME_DB;
const USER_DB = process.env.USER_DB;
const HOST_DB = process.env.HOST_DB;
const PASSWORD_DB = process.env.PASSWORD_DB;

module.exports = {
  development: {
    username: USER_DB,
    password: PASSWORD_DB,
    database: NAME_DB,
    host: HOST_DB,
    // port: PORT_DB,
    dialect: "mysql"
  },
  production: {
    username: USER_DB,
    password: PASSWORD_DB,
    database: NAME_DB,
    host: HOST_DB,
    // port: PORT_DB,
    dialect: "mysql"
  }
}