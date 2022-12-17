const validJwt = require('./validJwt');
const validRoles = require('./validRoles');
const validFields = require('./validFields');

module.exports = {
  ...validJwt,
  ...validRoles,
  ...validFields
}