const { notFoundPageController } = require('./controllers');
const expressMessages = require('express-messages');
const { authenticate } = require('./helpers/authentication');
// upload and storage dep
var multer  = require('multer');
const { storage } = require('./helpers/storage');
const path = require('path');

// error handler
function errorHandler(error, req, res, next) {
  if (error) {
    console.log(error);
    if (error.message === 'Password do not match') {
      req.flash('error', 'Username or password not correct');
      res.redirect('/admin/login');
    }
    notFoundPageController(req, res, next);
  } else {
    next();
  }
}

// Messages middleware
function messagesMiddleware(req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
}

// authentication middleware
const isAuthenticated = async (req, res, next) => {
  try {
    let auth = await authenticate(req);
    if (!auth) {
      res.redirect('/admin/login');
    } else {
      next();
    }
  }
  catch(e) {
    next(e);
  }
}

// upload middleware
const upload = multer({
  storage: storage,
  limits: { fieldSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }

});

function checkFileType(file, cb) {
  //allowed extentions
  const filetypes = /jpeg|jpg|png|gif/;
  //check extentions
  const extentionName = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check the  mimetype for image
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extentionName) {
    return cb(null, true);
  } else {
    return cb('Images only !!')
  }
}

module.exports = {
  errorHandler,
  messagesMiddleware,
  isAuthenticated,
  upload,
};
