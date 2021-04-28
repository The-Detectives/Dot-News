const { updateArticleDetails } = require('../../models/articleModel');

// handling update article
module.exports = async (req, res, next) => {
  let articleData = req.body;
  try {
    await updateArticleDetails(articleData);

    req.flash('info', 'Article updated successfully');
    res.redirect('/admin/dashboard');
  } catch (e) {
    next(e);
  }
};
