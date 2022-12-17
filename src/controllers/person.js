const { Person, User } = require('../db/models');
const bcryptjs = require('bcryptjs');

// Public
const getPerson = async (req, res) => {
  const { id } = req.params;

  try {
    const person = await Person.findByPk(id, {
      include: ['user'],
    });
    
    res.status(200).json(person);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

// Public
const getPersons = async (req, res) => {
  const { limit = 5, offset = 0 } = req.query;
  // const query = { state: true }

  try {
    const [ count, persons ] = await Promise.all([
      Person.count(),
      Person.findAll({
        // include: ['user'],
        limit: Number(limit),
        offset: Number(offset)
      })  
    ]);
    
    res.status(200).json({
      count,
      persons
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

// Public
const createPerson = async (req, res) => {
  console.log(req.body)
  const { user, ...rest } = req.body;

  try {
    // Encriptando contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(user.password, salt);

    // Se crea el usuario para la persona
    const newUser = await User.create(user);
    console.log(newUser);

    rest.userId = newUser.id;
    
    const newPerson = await Person.create(rest);

    res.status(201).json({
      msg: 'Person created successfull',
      newPerson
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

// Private - only an admin can update
const updatePerson = async (req, res) => {
  const { id } = req.params;
  const { userId, ...body } = req.body;

  try {
    const person = await Person.findByPk(id);

    if(!person) {
      return res.status(404).json({
        msg: `There is no person with the id ${id}`
      });
    }
    
    await person.update(body);
    const { createdAt, updatedAt, ...updatePerson } = person.dataValues;

    res.status(200).json({
      msg: 'Person update successfull',
      updatePerson
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }  
};

// Private - only an admin can delete
const deletePerson = async (req, res) => {
  const { id } = req.params;

  try {
    const person = await Person.findByPk(id);

    if(!person) {
      return res.status(404).json({
        msg: `There is no person with the id ${id}`
      });
    }

    // Se elimina la persona, pero no deberia eliminarse nunca
    await person.destroy(id);

    res.json({
      msg: 'Person delete successfull',
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
  getPerson,
  getPersons,
  createPerson,
  updatePerson,
  deletePerson
}