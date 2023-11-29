const multer = require('multer');
const fs = require('fs');


const saveImage = (file, fieldname) => {
  let destinationFolder;

  switch (fieldname) {
    case 'profile':
      destinationFolder = 'uploads/profiles/';
      break;
    case 'product':
      destinationFolder = 'uploads/products/';
      break;
    case 'document':
      destinationFolder = 'uploads/documents/';
      break;
    default:
      destinationFolder = 'uploads/';
  }

  const newPath = `${destinationFolder}${file.originalname}`;
  fs.renameSync(file.path, newPath);
  return newPath;
};

const upload = multer({ dest: 'uploads/' }).fields([
{ name: 'document', maxCount: 10 },
{ name: 'product', maxCount: 5 },
{ name: 'profile', maxCount: 1 },
]);

module.exports = { upload, saveImage };
