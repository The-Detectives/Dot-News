const { dbExcecute } = require('../helpers/pgClient');

function getCategories() {
  let categorySql = 'SELECT * FROM category;';
  return dbExcecute(categorySql)
    .then((categories) => categories)
    .catch((e) => {
      throw new Error(e);
    });
}

module.exports = {
  getCategories,
};
