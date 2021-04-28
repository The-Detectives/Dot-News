const superagent = require('superagent');

// function to get data from API
const getDataFromAPI = async (url, params, headers) => {
  try {
    let response = await superagent
      .get(url)
      .set(headers || {})
      .query(params || {});

    return response.body;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getDataFromAPI,
};
