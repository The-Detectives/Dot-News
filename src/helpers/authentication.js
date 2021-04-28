const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { findByToken } = require('../models/usersModel');

// function to check if the user is authenticated
const authenticate = async (userReq) => {
  try {
    let token = userReq.session.user ? userReq.session.user.token : null;
    let user = await findByToken(token);
    if (user && user.username == userReq.session.user.username) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw new Error(e);
  }
};

// function to check password
function checkPassword(reqPassword, foundUser) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(reqPassword, foundUser.password, (err, response) => {
      if (err) {
        reject(err);
      } else if (response) {
        resolve(response);
      } else {
        reject(new Error('Password do not match'));
      }
    });
  });
}

// function to generate random token
function createToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'));
    });
  });
}

module.exports = {
  authenticate,
  checkPassword,
  createToken,
};
