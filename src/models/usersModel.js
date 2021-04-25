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

module.exports = {
  findByToken,
};
