const { Product, Category } = require('../models');

const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    res.status(200).json(product);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
}

const getProducts = async (req, res) => {
  const { limit = 5, offset = 0 } = req.query;
  const query = { state: true };

  try {
    const [count, products] = await Promise.all([
      Product.count({ where: query }),
      Product.findAll({
        where: query,
        include: ['category'],
        limit: Number(limit),
        offset: Number(offset)
      })
    ]);

    res.status(200).json({
      count,
      products
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
}

const createProduct = async (req, res) => {
  const { name, state, ...rest } = req.body;
  const nameUpper = name.toUpperCase();

  try {
    const product = await Product.findOne({ where: { name: nameUpper } });

    if (product) {
      return res.status(400).json({
        msg:`'There is already a product with the name ${nameUpper}`
      })
    }

    const data = {
      ...rest,
      name: nameUpper
    }

    const newProduct = await Product.create(data);

    res.status(201).json({
      msg: 'Product created successfully',
      newProduct
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
}

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { state, ...data } = req.body;

  try {
    if (data.name) {
      data.name = data.name.toUpperCase();
    }

    if (data.categoryId) {
      const category = await Category.findByPk(data.categoryId);

      if (!category) {
        res.status(404).json({
          msg: `There is no category with id ${data.categoryId}`
        })
      };
    };

    const product = await Product.findByPk(id);

    const upadteProduct = await product.update(data);

    res.status(200).json({
      msg: 'Product updated successfully',
      upadteProduct
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
}

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if(!product) {
      return res.status(404).json({
        msg: `There is no product with the id ${id}`
      })
    }

    // await product.update({ state: false });
    await product.destroy();

    res.status(200).json({
      msg: 'Product delete successfull',
      id
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
}

module.exports = {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
}