const { dbExcecute } = require('../../helpers/pgClient');
const { checkPassword, createToken } = require('../../helpers/authentication');

// handling login
module.exports = function loginFormController(req, res, next) {
  const userReq = req.body;
  let user;

  let getUserQuery = 'SELECT * FROM users WHERE username=$1;';
  dbExcecute(getUserQuery, [userReq.username])
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
      let getUserQuery =
        'UPDATE users SET token=$1 WHERE id=$2 RETURNING id, username, token;';

      return dbExcecute(getUserQuery, [token, user.id]).then(
        (data) => (user = data[0])
      );
    })
    .then(() => {
      delete user.password;
      req.session.user = user;
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
};
