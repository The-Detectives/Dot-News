const { dbExcecute } = require('../helpers/pgClient');

function getArticles(category = '', keyword = '', limit = 10, offset = 0) {
  let sqlQuery = 'SELECT * FROM article ORDER BY id DESC LIMIT $1 OFFSET $2;';
  let safeValues = [limit, offset];
  if (category && category !== '' && keyword && keyword !== '') {
    keyword = `%${keyword}%`;
    sqlQuery =
      'SELECT * FROM category JOIN article ON article.category_id = category.id WHERE name = $1 AND UPPER(title) LIKE UPPER($2) ORDER BY article.id DESC LIMIT $3 OFFSET $4;';
    safeValues = [category, keyword, limit, offset];
  } else if (category && category !== '') {
    sqlQuery =
      'SELECT * FROM category JOIN article ON article.category_id = category.id WHERE name = $1 ORDER BY article.id DESC LIMIT $2 OFFSET $3;';
    safeValues = [category, limit, offset];
  } else if (keyword && keyword !== '') {
    keyword = `%${keyword}%`;
    sqlQuery = 'SELECT * FROM article WHERE UPPER(title) LIKE UPPER($1) ORDER BY id DESC LIMIT $2 OFFSET $3;';
    safeValues = [keyword, limit, offset];
  }

  return dbExcecute(sqlQuery, safeValues)
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

function getArticleDetails(articleId) {
  let SQL1 =
    'SELECT * From category JOIN article ON article.category_id = category.id WHERE article.id= $1;';
  let safeValues1 = [articleId];

  return dbExcecute(SQL1, safeValues1)
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

function addNewArticle(articleData) {
  let sqlQuery =
    'INSERT INTO article (title, image, content, published_date, category_id) VALUES ($1, $2, $3, $4, $5);';
  let safeValues = [
    articleData.title,
    articleData.image,
    articleData.content,
    new Date(),
    articleData.category,
  ];

  return dbExcecute(sqlQuery, safeValues)
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

function deleteArticle(articleId) {
  let sqlQuery = 'DELETE FROM article WHERE id = $1;';

  return dbExcecute(sqlQuery, [articleId])
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

function countArticles(category = '', keyword = '') {
  let sqlCountAllQuery = 'SELECT COUNT(*) FROM article;';
  let safeValues = [];
  if (category && category !== '' && keyword && keyword !== '') {
    keyword = `%${keyword}%`;
    sqlCountAllQuery =
      'SELECT COUNT(*) FROM category JOIN article ON article.category_id = category.id WHERE name = $1 AND UPPER(title) LIKE UPPER($2);';
    safeValues = [category, keyword];
  } else if (category && category !== '') {
    sqlCountAllQuery =
      'SELECT COUNT(*) FROM category JOIN article ON article.category_id = category.id WHERE name = $1;';
    safeValues = [category];
  } else if (keyword && keyword !== '') {
    keyword = `%${keyword}%`;
    sqlCountAllQuery = 'SELECT COUNT(*) FROM article WHERE UPPER(title) LIKE UPPER($1);';
    safeValues = [keyword];
  }

  return dbExcecute(sqlCountAllQuery, safeValues)
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

function updateArticleDetails(articleData) {
  let sqlQuery =
    'UPDATE article SET title=$1, image=$2, content=$3, category_id=$4 WHERE id =$5';
  let safeValues = [
    articleData.title,
    articleData.image,
    articleData.content,
    articleData.category,
    articleData.id,
  ];

  return dbExcecute(sqlQuery, safeValues)
    .then((data) => data)
    .catch((e) => {
      throw new Error(e);
    });
}

module.exports = {
  getArticles,
  getArticleDetails,
  addNewArticle,
  deleteArticle,
  countArticles,
  updateArticleDetails,
};
