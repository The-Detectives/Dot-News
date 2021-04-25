const { getUser, updateUserToken } = require('../../models/usersModel');
const { checkPassword, createToken } = require('../../helpers/authentication');

// handling login
module.exports = function loginFormController(req, res, next) {
  const userReq = req.body;
  let user;

  getUser(userReq.username)
    .then((data) => {
      user = data[0];
      if (!user) {
        req.flash('error', 'Username or password not correct');
        res.redirect('/admin/login');
      }
      return checkPassword(userReq.password, user);
    })
    .then((response) => createToken())
    .then((token) => {
      return updateUserToken(token, user.id).then((data) => (user = data[0]));
    })
    .then(() => {
      delete user.password;
      req.session.user = user;
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
};
