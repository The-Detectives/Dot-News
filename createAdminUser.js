/* import requirements */

require('dotenv').config();
const readline = require('readline');
const { client } = require('./helpers/pgClient');
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
  return client
    .query(sqlQuery, [user.username, user.password, user.token])
    .then((data) => data.rows[0])
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
      client.end();
    })
    .catch((e) => console.log(e));
}

client
  .connect()
  .then(() => {
    /* Creating an instance of readline */
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    /* Display the messages to the user */
    rl.question('Enter the username: ', function (username) {
      rl.question('Enter the password :', function (password) {
        let user = {
          username: username,
          password: password,
        };

        createAdminUser(user);

        rl.close();
      });
    });

    rl.on('close', function () {
      console.info('Exitting ...');
      // client.end();
      // process.exit(0);
    });
  })
  .catch((e) => console.log(e));
