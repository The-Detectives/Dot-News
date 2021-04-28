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
const createUser = async (user) => {
  try {
    let sqlQuery =
      'INSERT INTO users (username, password, token) VALUES ($1, $2, $3) RETURNING id, username, token;';

    let data = await client.query(sqlQuery, [
      user.username,
      user.password,
      user.token,
    ]);
    return data.rows[0];
  } catch (e) {
    throw new Error(e);
  }
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
const createAdminUser = async (user) => {
  try {
    let hashedPassword = await hashPassword(user.password);
    delete user.password;
    user.password = hashedPassword;

    let token = await createToken();
    user.token = token;

    await createUser(user);

    console.info('User admin created successfully');
    console.info('You can login now.');
    client.end();
  } catch (e) {
    client.end();
    throw new Error(e);
  }
};

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
      rl.stdoutMuted = true;
      rl.passwordQuery = 'Enter the password :';
      rl.question(rl.passwordQuery, function (password) {
        let user = {
          username: username,
          password: password,
        };

        createAdminUser(user)
        .then(rl.close())
        .catch(e => {throw new Error(e);});
      });
      rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (rl.stdoutMuted)
          rl.output.write(
            '\x1B[2K\x1B[200D' +
              rl.passwordQuery +
              '[' +
              (rl.line.length % 2 == 1 ? '=-' : '-=') +
              ']'
          );
        else rl.output.write(stringToWrite);
      };
    });

    rl.on('close', function () {
      console.info('Exitting ...');
      // client.end();
      // process.exit(0);
    });
  })
  .catch((e) => console.log(e));
