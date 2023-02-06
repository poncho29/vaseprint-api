const { response } =  require('express');
const bcryptjs = require('bcryptjs');

const { generateJWT } = require('../helpers/generateJwt');

const { User } = require('../models');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    const user = await User.findOne({where: { email }});
    if(!user) {
      return res.status(400).json({
        msg: 'User / Password incorrect - email'
      });
    };

    // Verificar si el user esta activo
    if(!user.state) {
      return res.status(400).json({
        msg: 'user does not exist - (state: false)'
      });
    };

    // Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if(!validPassword) {
      return res.status(400).json({
        msg: 'User / Password incorrect - password'
      })
    };

    // Generar JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      msg: 'Internal Server Error'
    });
  };
};

module.exports = {
  login
}