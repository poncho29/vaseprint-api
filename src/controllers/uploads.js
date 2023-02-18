const fs = require('fs');
const path = require('path');
const { response } = require("express");
const { User, Product } = require('../models');

const { fileUploadHelper } = require('../helpers');

const uploadFile = async (req, res = response) => {
  try {
    // Guarda imagenes
    const nameFile = await fileUploadHelper(req.files, undefined, 'images');
    res.json({ nameFile });
  } catch (msg) {
    res.status(400).json({ msg });
  }
}

const updateImage = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch(collection) {
    case 'users':
      model = await User.findByPk(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;

    case 'products':
        model = await Product.findByPk(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`
          });
        }
        break;

    default:
      return res.status(500).json({ msg: `La coleccion ${collection} no existe.` })
  }

  // Limpiar imagenes previas
  if (model.img) {
    // Borrar la imagen del servidor
    const pathImg = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  // Se gurada el archivo
  const nameFile = await fileUploadHelper(req.files, undefined, collection);

  // Se guarda el nombre de la imagen en el modelo
  await model.update({ img: nameFile });

  res.json({
    msg: 'Archivo agregado',
    name: nameFile
  });
} 

// Obtener una imagen
const getImage = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch(collection) {
    case 'users':
      model = await User.findByPk(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      } 
      break;

    case 'products':
        model = await Product.findByPk(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`
          });
        }
        break;

    default:
      return res.status(500).json({ msg: `La coleccion ${collection} no existe.` })
  }

  // Limpiar imagenes previas
  if (model.img) {
    // Borrar la imagen del servidor
    const pathImg = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImg)) {
      res.sendFile(pathImg);
    }
  }

  const pathNoImg = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathNoImg);
}

module.exports = {
  getImage,
  uploadFile,
  updateImage
}