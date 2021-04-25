const { dbExcecute } = require('../../helpers/pgClient');

// handling update article
module.exports = function updateArticleController(req, res, next) {
  let articleData = req.body;

  let sqlQuery =
    'UPDATE article SET title=$1, image=$2, content=$3, category_id=$4 WHERE id =$5';
  let safeValues = [
    articleData.title,
    articleData.image,
    articleData.content,
    articleData.category,
    articleData.id,
  ];

  dbExcecute(sqlQuery, safeValues)
    .then(() => {
      req.flash('info', 'Article updated successfully');
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
};
