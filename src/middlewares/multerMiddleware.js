const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationFolder;

    if (req.body.type === 'profile') {
      destinationFolder = 'uploads/profiles/';
    } else if (req.body.type === 'product') {
      destinationFolder = 'uploads/products/';
    } else if (req.body.type === 'document') {
      destinationFolder = 'uploads/documents/';
    } else {
      destinationFolder = 'uploads/'; 
    }

    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;