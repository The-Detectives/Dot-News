const { notFoundPageController } = require('./controllers');
const expressMessages = require('express-messages');
const { authenticate } = require('./helpers/authentication');

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

module.exports = {
  errorHandler,
  messagesMiddleware,
  isAuthenticated,
};
