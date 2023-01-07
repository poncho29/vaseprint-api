const { response } = require("express");

const validRole = (req, res = response, next) => {
  if(!req.user) {
    return res.status(500).json({
      msg: 'Se quiere verificar el role sin validar el token'
    });
  }

  const { roleId, email } = req.user;

  // if(role !== 'ADMIN_ROLE') {
  if(roleId !== 1) {
    return res.status(401).json({
      msg: `${email} no es administrador - no puede realizar esta acción`
    });
  }

  next();
}

module.exports = {
  validRole
}