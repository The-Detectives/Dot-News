const { getCategories } = require('../../models/categoryModel');

module.exports = async (req, res, next) => {
  try {
    let categories = await getCategories();
    res.render('pages/contactUs', { categories: categories });
  }
  catch(e) {
    next(e)
  }
};
