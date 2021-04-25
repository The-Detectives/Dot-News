const superagent = require('superagent');

// function to get data from API
function getDataFromAPI(url, params, headers) {
  return superagent
    .get(url)
    .set(headers || {})
    .query(params || {})
    .then((response) => response.body)
    .catch((e) => {
      throw new Error(e);
    });
}

module.exports = {
  getDataFromAPI,
};