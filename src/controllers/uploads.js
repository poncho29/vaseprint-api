const fs = require('fs');
const path = require('path');

// Autenticacion con claudinary
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { User, Product } = require('../models');

const { fileUploadHelper } = require('../helpers');

const uploadFile = async (req, res = response) => {
  try {
    // Guarda imagenes
    const nameFile = await fileUploadHelper(req.files.file, undefined, 'images');
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

  // Buscar la imagen
  if (model.img) {
    // Busca la imagen en el servidor y la regresa
    const pathImg = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  const pathNoImg = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathNoImg);
}

// CLOUDYNARY
const updateImageCloudinary = async (req, res = response) => {
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
    const nameArr = model.img.split('/');
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split('.');

    await cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  // // Se guarda el nombre de la imagen en el modelo
  await model.update({ img: secure_url });

  res.json({
    msg: 'Archivo agregado',
    model
  });
}

module.exports = {
  getImage,
  uploadFile,
  updateImage,
  updateImageCloudinary
}