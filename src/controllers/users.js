const { User } = require('../db/models');
const bcryptjs = require('bcryptjs');

// Public
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: ['role'],
    });
    
    res.status(200).json(user)
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
  const query = { state: true }

  try {
    const [ count, users ] = await Promise.all([
      User.count({where: query}),
      User.findAll({
        where: query,
        // include: ['role'],
        limit: Number(limit),
        offset: Number(offset)
      })  
    ]);
    
    res.status(200).json({
      count,
      users
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
  const { password, ...rest } = req.body

  try {
    // Encriptando contraseña
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);

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

    await user.update(rest);

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
    await user.update({state: false});

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