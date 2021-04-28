const { setUserTokenNull } = require('../../models/usersModel');

// handling logout
module.exports = async (req, res, next) => {
  try {
    await setUserTokenNull(req.session.user.username);

    req.session = null;
    res.redirect('/admin/login');
  } catch (e) {
    next(e);
  }
};
