const { getCategories } = require('../../models/categoryModel');

// handling the add new article page
module.exports = async (req, res, next) => {
  try {
    let categories = await getCategories();
    res.render('pages/admin/article', {
      categories: categories,
      article: {},
    });
  } catch (e) {
    next(e);
  }
};
