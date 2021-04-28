const { deleteArticle } = require('../../models/articleModel');

// handling delete article
module.exports = async (req, res, next) => {
  let articleId = req.params.id;
  try {
    await deleteArticle(articleId);
    req.flash('info', 'Article Deleted successfully');
    res.redirect('/admin/dashboard');
  } catch (e) {
    next(e);
  }
};
