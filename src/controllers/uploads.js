const fs = require('fs');
const path = require('path');

// Autenticacion con claudinary
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { User, Product } = require('../models');

const { fileUploadHelper } = require('../helpers');

// const uploadFile = async (req, res = response) => {

//   console.log(req.files)
//   try {
//     // Guarda imagenes
//     // const nameFile = await fileUploadHelper(req.files.file, undefined, 'images');
//     res.json({ nameFile });
//   } catch (msg) {
//     res.status(400).json({ msg });
//   }
// }

// const updateImage = async (req, res = response) => {
//   const { id, collection } = req.params;

//   let model;

//   switch(collection) {
//     case 'users':
//       model = await User.findByPk(id);
//       if (!model) {
//         return res.status(400).json({
//           msg: `No existe un usuario con el id ${id}`
//         });
//       }
//       break;

//     case 'products':
//         model = await Product.findByPk(id);
//         if (!model) {
//           return res.status(400).json({
//             msg: `No existe un producto con el id ${id}`
//           });
//         }
//         break;

//     default:
//       return res.status(500).json({ msg: `La coleccion ${collection} no existe.` })
//   }

//   // Limpiar imagenes previas
//   if (model.img) {
//     // Borrar la imagen del servidor
//     const pathImg = path.join(__dirname, '../uploads', collection, model.img);
//     if (fs.existsSync(pathImg)) {
//       fs.unlinkSync(pathImg);
//     }
//   }

//   // Se gurada el archivo
//   const nameFile = await fileUploadHelper(req.files, undefined, collection);

//   // Se guarda el nombre de la imagen en el modelo
//   await model.update({ img: nameFile });

//   res.json({
//     msg: 'Archivo agregado',
//     name: nameFile
//   });
// } 

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
const uploadImageCloudinary = async (req, res = response) => {
  const { file } = req.files;
  let url = '';

  try {
    if (file.length > 3) {
      return res.status(400).json({
        msg: 'No se pueden enviar más de 3 archivos'
      });
    }

    if (file.length > 1) {
      const imgPromises = req.files.map(async (img) => {
        const promise = await cloudinary.uploader.upload(img.tempFilePath);
        
        return promise;
      });

      const images = await Promise.all(imgPromises);
      const urlImages = images.map((img) => {
        return img.secure_url
      });

      url = JSON.stringify(urlImages);      
    } else {
      const { tempFilePath } = file;
      url = await cloudinary.uploader.upload(tempFilePath);
    }

    res.json({
      msg: 'Archivo agregado',
      url: url.secure_url
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }  
}

const deleteImageCloudinary = async (req, res = response) => {
  const { id } = req.params;
  
  
  try {
    if (id === ':id') {
      return res.status(400).json({
        msg: 'El public id es requerido'
      });
    }

    const { result } = await cloudinary.uploader.destroy(id)

    if (result === 'not found') {
      return res.status(400).json({
        msg: `No se encontro ninguna imagen con el id ${id}`
      });
    }

    res.status(200).json({
      msg: 'Archive eliminado',
      result
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Internal Server Error'
    });
  }
}

const updateImageCloudinary = async (req, res = response) => {
  // const { id, collection } = req.params;
  console.log(req)

  // let model;

  // switch(collection) {
  //   case 'users':
  //     model = await User.findByPk(id);
  //     if (!model) {
  //       return res.status(400).json({
  //         msg: `No existe un usuario con el id ${id}`
  //       });
  //     }
  //     break;

  //   case 'products':
  //       model = await Product.findByPk(id);
  //       if (!model) {
  //         return res.status(400).json({
  //           msg: `No existe un producto con el id ${id}`
  //         });
  //       }
  //       break;

  //   default:
  //     return res.status(500).json({ msg: `La coleccion ${collection} no existe.` })
  // }

  // Limpiar imagenes previas
  // if (model.img) {
  //   const nameArr = model.img.split('/');
  //   const name = nameArr[nameArr.length - 1];
  //   const [public_id] = name.split('.');

  //   await cloudinary.uploader.destroy(public_id)
  // }

  // const { tempFilePath } = req.files.file;
  // const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  // // Se guarda el nombre de la imagen en el modelo
  // const url = await model.update({ img: secure_url });

  res.json({
    msg: 'Archivo agregado',
    url: req
  });
}


module.exports = {
  getImage,
  uploadImageCloudinary,
  updateImageCloudinary,
  deleteImageCloudinary
}