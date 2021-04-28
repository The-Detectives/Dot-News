const { getCategories } = require('../../models/categoryModel');

// handling the about us page
module.exports = async (req, res, next) => {
  try {
    let categories = await getCategories();
    res.render('pages/aboutUs', { categories: categories });
  }
  catch(e) {
    next(e)
  }
};
