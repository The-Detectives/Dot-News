const { addNewArticle } = require('../../models/articleModel');

// handling creating new article
module.exports = async (req, res, next) => {
  let articleData = req.body;
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a the image')
    return next(error)
  }
  res.send(file)
  // try {
  //   await addNewArticle(articleData);
  //   req.flash('info', 'Article Added successfully');
  //   res.redirect('/admin/dashboard');
  // } catch (e) {
  //   next(e);
  // }
};
