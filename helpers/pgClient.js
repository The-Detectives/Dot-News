const { Client } = require('pg');

//init pg clinet
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DEV_MODE ? false : { rejectUnauthorized: false },
});

// function to exceute statement to database
function dbExcecute(sqlQuery, values = []) {
  let result = client
    .query(sqlQuery, values)
    .then((data) => {
      let result = data.rows;
      return result;
    })
    .catch((e) => {
      throw new Error(e);
    });

  return result;
}

module.exports = {
  dbExcecute,
  client,
};
