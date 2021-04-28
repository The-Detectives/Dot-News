const { Client } = require('pg');

//init pg clinet
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DEV_MODE ? false : { rejectUnauthorized: false },
});

// function to exceute statement to database
const dbExcecute = async (sqlQuery, values = []) => {
  try {
    let data = await client.query(sqlQuery, values);
    let result = data.rows;
    return result;
  }
  catch(e) {
    throw new Error(e);
  }
}

module.exports = {
  dbExcecute,
  client,
};
