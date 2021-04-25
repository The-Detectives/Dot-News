const { dbExcecute } = require('../helpers/pgClient');

function saveContactMessage(contactData) {
  let sqlContact =
    'INSERT INTO contact (name, phone, email, message, date) VALUES ($1, $2, $3, $4, $5);';
  let safeValues1 = [
    contactData.username,
    contactData.phone,
    contactData.email,
    contactData.message,
    new Date(),
  ];
  return dbExcecute(sqlContact, safeValues1)
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

function getContactMessages() {
  let contactSql = 'SELECT * FROM contact ORDER BY id DESC;';

  return dbExcecute(contactSql)
    .then((messages) => messages)
    .catch((e) => {
      throw new Error(e);
    });
}

module.exports = {
  saveContactMessage,
  getContactMessages,
};
