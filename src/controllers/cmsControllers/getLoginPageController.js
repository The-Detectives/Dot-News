const { authenticate } = require('../../helpers/authentication');

// handling the login form page
module.exports = function getLoginPageController(req, res, next) {
  authenticate(req).then((auth) => {
    if (auth) {
      res.redirect('/admin/dashboard');
    } else {
      res.render('pages/admin/login');
    }
  });
};
