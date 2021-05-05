const { dbExcecute } = require('../helpers/pgClient');

function saveUploadFile(fileUrl) {
  let sqlContact = 'INSERT INTO file (link) VALUES ($1) RETURNING id;';
  let safeValues1 = [fileUrl];
  return dbExcecute(sqlContact, safeValues1)
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

module.exports = {
  saveUploadFile,
};
