const { dbExcecute } = require('./helpers/pgClient');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// functino to hash the plain text password
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash);
    });
  });
};

// function to create the user
const createUser = (user) => {
  let sqlQuery =
    'INSERT INTO users (username, password, token) VALUES ($1, $2, $3) RETURNING id, username, token;';
  return dbExcecute(sqlQuery, [user.username, user.password, user.token])
    .then((data) => data[0])
    .catch((e) => console.log(e));
};

// function to generate random token

function createToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'));
    });
  });
}

// function to create admin user
function createAdminUser(user) {
  console.log('sdfdsd', process.env.NODE_ENV);
  hashPassword(user.password)
    .then((hashedPassword) => {
      delete user.password;
      user.password = hashedPassword;
    })
    .then(() => createToken())
    .then((token) => (user.token = token))
    .then(() => createUser(user))
    .then((user) => {
      console.log(user);
      console.info('User admin created successfully');
      console.info('You can login now.');
    })
    .catch((e) => console.log(e));
}

let userData = process.argv.slice(2);

if (userData.length < 2) {
  console.error('You have to enter both, the username and the password.');
  console.info('Try again please!');
  return;
}

let user = {
  username: userData[0],
  password: userData[1],
};

createAdminUser(user);
