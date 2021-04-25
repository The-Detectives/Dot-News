const { setUserTokenNull } = require('../../models/usersModel');

// handling logout
module.exports = function logoutController(req, res, next) {
  setUserTokenNull(req.session.user.username)
    .then(() => {
      req.session = null;
      res.redirect('/admin/login');
    })
    .catch((e) => next(e));
};
