var multer = require('multer');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/media/img');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.originalname.split('.')[0] + '-' + uniqueSuffix + '.' + file.originalname.split('.')[1] );
  },
});

module.exports = {
  storage,
};
