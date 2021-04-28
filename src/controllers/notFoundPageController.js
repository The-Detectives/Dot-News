const { getCategories } = require('../models/categoryModel');

module.exports = async (req, res, next) => {
  try {
    let categories = await getCategories();
    res.status(401).render('pages/error', { categories: categories });
  } catch (e) {
    next(e);
  }
};
