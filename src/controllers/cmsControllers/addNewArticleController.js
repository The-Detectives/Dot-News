const { addNewArticle } = require('../../models/articleModel');

// handling creating new article
module.exports = async (req, res, next) => {
  let articleData = req.body;
  try {
    await addNewArticle(articleData);
    req.flash('info', 'Article Added successfully');
    res.redirect('/admin/dashboard');
  } catch (e) {
    next(e);
  }
};
