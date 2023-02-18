const validJwt = require('./validJwt');
const validRoles = require('./validRoles');
const validFields = require('./validFields');
const validFile = require('./validFile');

module.exports = {
  ...validJwt,
  ...validRoles,
  ...validFields,
  ...validFile
}