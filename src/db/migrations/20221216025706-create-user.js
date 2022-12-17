'use strict';

const { UserSchema, USER_TABLE } = require('./../models/user');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // El up hace la creacion
  async up (queryInterface) {
    await queryInterface.createTable(USER_TABLE, UserSchema);
  },

  // El down no permite recuperar version anteriores
  async down (queryInterface) {
    await queryInterface.drop(USER_TABLE);
  }
};
