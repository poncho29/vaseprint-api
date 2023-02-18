const fs = require('fs');
const path = require('path');
const bcryptjs = require('bcryptjs');

const { User } = require('../models');
const { fileUploadHelper } = require('../helpers');

// Public
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    const { password, state, ...rest } = user.dataValues;
    
    res.status(200).json({
      user: rest
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

// Public
const getUsers = async (req, res) => {
  const { limit = 5, offset = 0 } = req.query;
  const query = { state: true };

  try {
    const [ count, users ] = await Promise.all([
      User.count({ where: query }),
      User.findAll({
        where: query,
        limit: Number(limit),
        offset: Number(offset)
      })  
    ]);

    let allUsers = [];
    for (const user of users) {
      const { password, state, ...rest } = user.dataValues;
      allUsers.push(rest);
    }
    
    res.status(200).json({
      count,
      users: allUsers
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

// Public
const createUser = async (req, res) => {
  const { password, state, ...rest } = req.body;
  const imgFile = req.files.img;

  try {
    // Encriptando contraseña
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);

    // Guardando imagen
    const imgName = await fileUploadHelper(imgFile, undefined, 'users');
    rest.img = imgName;

    const newUser = await User.create(rest);

    res.status(201).json({
      msg: 'User created successfull',
      newUser
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

// Private - only an admin can update
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password, ...rest } = req.body;
  const imgFile = req.files.img;

  try {
    const user = await User.findByPk(id);

    if(!user) {
      return res.status(404).json({
        msg: `There is no user with the id ${id}`
      });
    }

    // Update password
    if (password) {
      const salt = bcryptjs.genSaltSync();
      rest.password = bcryptjs.hashSync(password, salt);
    }

    // Limpiar imagenes previa
    if (user.img) {
      // Borrar la imagen del servidor
      const pathImg = path.join(__dirname, '../uploads', 'users', user.img);
      if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
      }
    }

    // Se guarda la nueva imagen
    rest.img = await fileUploadHelper(imgFile, undefined, 'users');

    await user.update(rest);

    delete user.dataValues.password;
    delete user.dataValues.state;

    res.status(200).json({
      msg: 'User update successfull',
      user
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }  
};

// Private - only an admin can delete
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if(!user) {
      return res.status(404).json({
        msg: `There is no user with the id ${id}`
      });
    }

    // Se elimina logicamente, cambiando el status
    // await user.update({state: false});
    await user.destroy();

    res.json({
      msg: 'User delete successfull',
      id
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser
}