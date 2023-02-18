const path = require('path');
const { v4: uuidv4 } = require('uuid');

const fileUploadHelper = (files, validExtensions = ['png', 'jpg', 'jpeg'], folder = '') => {

  return new Promise((resolve, reject) => {
    const { file } = files;
    const shortName = file.name.split('.');
    const extension = shortName[shortName.length - 1];

    // Validar la extension
    if(!validExtensions.includes(extension)) {
      return reject(`La extensión ${extension} no es permitida, extensiones validas (${validExtensions}).`);
    }

    // Redefinimos la ruta hacia la carperta upoloads
    const nameTemp = uuidv4() + '.' + extension;
    // Folder es el nomber de una carpeta nueva si no viene no afecta
    uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);

    file.mv(uploadPath, function(err) {
      if (err) {
        reject(err);
      }

      resolve(nameTemp);
    });
  });
}

module.exports = {
  fileUploadHelper
}