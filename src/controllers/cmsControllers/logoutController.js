const { dbExcecute } = require('../../helpers/pgClient');

// handling logout
module.exports = function logoutController(req, res, next) {
  let sqlQuery = 'UPDATE users SET token=NULL WHERE username=$1';

  dbExcecute(sqlQuery, [req.session.user.username])
    .then(() => {
      req.session = null;
      res.redirect('/admin/login');
    })
    .catch((e) => next(e));
};
