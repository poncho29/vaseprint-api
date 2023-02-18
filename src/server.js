const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const connection = require('./db/sequelize');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      users: '/api/users',
      orders: '/api/orders',
      uploads: '/api/uploads',
      products: '/api/products',
      categories: '/api/categories',
    }

    this.dbConnection();

    this.middlewares();

    this.routes();
  };

  async dbConnection() {
    try {
      await connection.authenticate();
      console.log('✅ Online Database');
    } catch (error) {
      console.log('❌ Error connecting database');
      throw new Error(error);
    }
  };

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());

    // Middleware para la carga de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    }));
  };

  routes() {
    this.app.use(this.paths.auth, require('./routes/auth')),
    this.app.use(this.paths.users, require('./routes/users')),
    this.app.use(this.paths.orders, require('./routes/orders')),
    this.app.use(this.paths.uploads, require('./routes/uploads')),
    this.app.use(this.paths.products, require('./routes/products')),
    this.app.use(this.paths.categories, require('./routes/categories'))
  };

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server listening on port ' + this.port);
    });
  };
}

module.exports = Server;