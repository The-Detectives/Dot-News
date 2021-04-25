const { dbExcecute } = require('../helpers/pgClient');

// function to get user by token
function findByToken(token) {
  let sqlQuery = 'SELECT * FROM users WHERE token=$1';
  return dbExcecute(sqlQuery, [token])
    .then((data) => {
      return data[0];
    })
    .catch((e) => {
      throw new Error(e);
    });
}

function getUser(username) {
  let getUserQuery = 'SELECT * FROM users WHERE username=$1;';
  return dbExcecute(getUserQuery, [username])
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

function updateUserToken(token, userId) {
  let getUserQuery =
    'UPDATE users SET token=$1 WHERE id=$2 RETURNING id, username, token;';

  return dbExcecute(getUserQuery, [token, userId])
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

function setUserTokenNull(username) {
  let sqlQuery = 'UPDATE users SET token=NULL WHERE username=$1';

  return dbExcecute(sqlQuery, [username])
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

module.exports = {
  findByToken,
  getUser,
  updateUserToken,
  setUserTokenNull,
};
