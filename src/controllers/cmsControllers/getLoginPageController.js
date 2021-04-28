const { authenticate } = require('../../helpers/authentication');

// handling the login form page
module.exports = async (req, res, next) => {
  try {
    let auth = await authenticate(req);
    if (auth) {
      res.redirect('/admin/dashboard');
    } else {
      res.render('pages/admin/login');
    }
  } catch (e) {
    next(e);
  }
};
