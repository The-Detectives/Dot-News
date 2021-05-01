const { getUser, updateUserToken } = require('../../models/usersModel');
const { checkPassword, createToken } = require('../../helpers/authentication');

// handling login
module.exports = async (req, res, next) => {
  const userReq = req.body;
  let user;

  try {
    let userData = await getUser(userReq.username);
    user = userData[0];

    if (!user) {
      req.flash('error', 'Username or password not correct');
      res.redirect('/admin/login');
    }

    await checkPassword(userReq.password, user);

    let token = await createToken();

    userData = await updateUserToken(token, user.id);
    user = userData[0];

    delete user.password;
    req.session.user = user;

    res.redirect('/admin/dashboard');
  } catch (e) {
    next(e);
  }
};
