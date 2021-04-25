const { dbExcecute } = require('../../helpers/pgClient');

// handling creating new article
module.exports = function addNewArticleController(req, res, next) {
  let articleData = req.body;

  let sqlQuery =
    'INSERT INTO article (title, image, content, published_date, category_id) VALUES ($1, $2, $3, $4, $5);';
  let safeValues = [
    articleData.title,
    articleData.image,
    articleData.content,
    new Date(),
    articleData.category,
  ];

  dbExcecute(sqlQuery, safeValues)
    .then(() => {
      req.flash('info', 'Article Added successfully');
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
};
