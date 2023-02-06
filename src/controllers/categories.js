const { Category } = require('../models');

const getCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id, {
      include: ['products']
    });

    res.status(200).json(category);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

const getCategories = async (req, res) => {
  const { limit = 5, offset = 0 } = req.query;
  const query = { state: true };

  try {
    const [count, categories] = await Promise.all([
      Category.count({ where: query }),
      Category.findAll({
        where: query,
        limit: Number(limit),
        offset: Number(offset)
      })
    ]);

    res.status(200).json({
      count,
      categories
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

const createCategory = async (req, res) => {
  const { name, state, ...rest } = req.body;
  const nameUpper = name.toUpperCase();

  try {
    const category = await Category.findOne({ where: { name: nameUpper } });

    if (category) {
      return res.status(400).json({
        msg:`'There is already a category with the name ${nameUpper}`
      });
    }

    const data = {
      ...rest,
      name: nameUpper
    }

    const newCategory = await Category.create(data);

    res.status(201).json({
      msg: 'Category created successfully',
      newCategory
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { state, ...data } = req.body;

  try {
    if (data.name) {
      data.name = data.name.toUpperCase();
    }

    const category = await Category.findByPk(id);

    const upadteCategory = await category.update(data);

    res.status(200).json({
      msg: 'Category updated successfully',
      upadteCategory
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if(!category) {
      return res.status(404).json({
        msg: `There is no category with the id ${id}`
      })
    }

    await category.update({ state: false });

    res.status(200).json({
      msg: 'Category delete successfull',
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
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};