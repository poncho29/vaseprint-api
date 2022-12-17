const { response } = require("express");

const validRole = (req, res = response, next) => {
  if(!req.user) {
    return res.status(500).json({
      msg: 'Se quiere verificar el role sin validar el token'
    });
  }

  const { roleId, name } = req.user;

  // if(role !== 'ADMIN_ROLE') {
  if(roleId !== 2) {
    return res.status(401).json({
      msg: `${name} no es administrador - no puede realizar esta acción`
    });
  }

  next();
}

module.exports = {
  validRole
}