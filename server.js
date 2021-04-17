// Application Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');
const { client } = require('./helpers/pgClient');
const { getDataFromAPI } = require('./helpers/superAgentClient');
const { dbExcecute } = require('./helpers/pgClient');
const { Article } = require('./store');

/* ---------- Application Setups ---------- */

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));


//Test Page (Home)
app.get('/test', (req, res, next) => {
  return res.send('Hello There');
});

//Routes
app.get('/', homeHandler);
app.get('/aboutUs', aboutUsHandler);
app.get('/:category', categoryHandler);
app.get('/article/:id', articleHandler);

//Admin routes
app.get('/admin/login', loginPageHandler);
app.get('/admin/dashboard', adminDashboardHandler);
app.get('/admin/article/new', adminNewArticleHandler);
app.post('/admin/article/new', adminCreateNewArticleHandler);
app.delete('/admin/article/:id', adminDeleteArticleHandler);
app.get('/admin/article/:id', adminShowArticleHandler);
app.put('/admin/article/:id', adminUpdateArticleHandler);

// error handler
app.use(errorHandler);

// Page not found handler
app.get('*', notFoundPageHandler);

/* --------- Functions Handling routes --------- */

// handling the home page
function homeHandler(req, res, next) {
  let key = process.env.CATEGORY_KEY;

  let worldURL = `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${key}`;
  let artsURL = `https://api.nytimes.com/svc/topstories/v2/arts.json?api-key=${key}`;
  let scienceURL = `https://api.nytimes.com/svc/topstories/v2/science.json?api-key=${key}`;
  let healthURL = `https://api.nytimes.com/svc/topstories/v2/health.json?api-key=${key}`;
  
  getDataFromAPI(worldURL)
    .then(worldData=>{
      let worldArray=worldData.results.slice(0,5).map(item=>{
        return new Article({...item, section: worldData.section });
      });

      getDataFromAPI(artsURL)
        .then(artsData=>{
          let artsArray=artsData.results.slice(0,10).map(item=>{
            return new Article({...item, section: artsData.section });
          });
        
        getDataFromAPI(scienceURL).then((scienceData) => {
          let scienceArray = scienceData.results.slice(0, 5).map((item) => {
            return new Article({ ...item, section: scienceData.section });
          });

              getDataFromAPI(healthURL)
                .then(healthData=>{
                  let healthArray=healthData.results.slice(0,5).map(item=>{
                    return new Article({...item, section: healthData.section });
                  });
                
                  let SQL='SELECT * FROM article;'
                  dbExcecute(SQL)
                  .then(data => {
                    let ourNews = data.slice(0,10);
                    res.render('index',{worldNews:worldArray, artsNews:artsArray, scienceNews:scienceArray, healthNews:healthArray, ourNews:ourNews}) 
                  })
                  .catch((e) => next(e));
                })
                  .catch((e) => next(e));
              })
              .catch((e) => next(e));
            })
            .catch((e) => next(e));
        })
      .catch((e) => next(e));
}


// handling the about us page
function aboutUsHandler(req, res, next){
  res.render('pages/aboutUs');
}

// handling the article page
function articleHandler(req, res, next) { //article
  let SQL1 = `SELECT * From article JOIN category ON article.category_id = category.id WHERE article.id= $1;`;
  let safeValues1 = [req.params.id];

  dbExcecute(SQL1, safeValues1)
    .then(result => {
      let article = result[0];
      let category = article.name;
      let CATEGORY_KEY = process.env.CATEGORY_KEY;
      let categoryUrl = `https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=${CATEGORY_KEY}`;
      getDataFromAPI(categoryUrl)
        .then(categoryData => {
          let arr = categoryData.results.slice(0, 6).map((val) => {
            return new Article({ ...val, section: categoryData.section });
          });
          
          res.render('pages/article', {articleData: article, articleCategory: arr});
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
}


// handling the category Page
function categoryHandler(req, res, next) {

  let categoryName = req.params.category;
  let category_API_KEY = process.env.CATEGORY_KEY;
  let categoryUrl = `https://api.nytimes.com/svc/topstories/v2/${categoryName}.json?api-key=${category_API_KEY}`;

  getDataFromAPI(categoryUrl)
    .then(categoryData => {

      let arr = categoryData.results.map((val) => {
        return new Article({ ...val, section: categoryData.section });
      });

      let sqlQuery = 'SELECT * FROM article JOIN category ON article.category_id = category.id WHERE name = $1'
      let safeValues = [categoryName]
      dbExcecute(sqlQuery, safeValues)
        .then(data => {

          let resultDb = data;

          res.render('pages/category', { categoryApi: arr, categoryDB: resultDb });

        })
        .catch((e) => next(e));
    })
    .catch((error) => {
      res.send(error);
    });
}


/* --------- Admin Handling routes --------- */

// handling the login form page
function loginPageHandler(req, res, next) {
  res.render('pages/admin/login');
}


// handling the admin dashboard page
function adminDashboardHandler(req, res, next) {
  let category_name = req.query.category ? [req.query.category] : [];

  let sqlQuery = 'SELECT * FROM article ORDER BY id DESC;';
  if (req.query.category) {
    sqlQuery =
      'SELECT * FROM article JOIN category ON article.category_id = category.id WHERE name = $1;';
  }

  dbExcecute(sqlQuery, category_name)
    .then((articles) => {
      let categorySqlQuery = 'SELECT * FROM category;';
      dbExcecute(categorySqlQuery)
        .then(categories => {
          res.render('pages/admin/dashboard', { articles: articles, categories: categories });
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
}


// handling the add new article page
function adminNewArticleHandler(req, res, next) {
  let categorySqlQuery = 'SELECT * FROM category';

  dbExcecute(categorySqlQuery)
    .then(categories => {
      res.render('pages/admin/article', { categories: categories, article: {} });
    })
    .catch((e) => next(e));
}

// handling creating new article
function adminCreateNewArticleHandler(req, res, next) {
  let articleData = req.body;

  let sqlQuery = 'INSERT INTO article (title, image, content, published_date, category_id) VALUES ($1, $2, $3, $4, $5);';
  let safeValues = [articleData.title, articleData.image, articleData.content, new Date(), articleData.category];

  dbExcecute(sqlQuery, safeValues)
    .then(res.redirect('/admin/dashboard'))
    .catch(e => next(e));
}

// handling delete article 
function adminDeleteArticleHandler(req, res, next) {
  let articleId = req.params.id;
  let sqlQuery = 'DELETE FROM article WHERE id = $1;';

  dbExcecute(sqlQuery, [articleId])
    .then(res.redirect('/admin/dashboard'))
    .catch(e => next(e));
}

// handling showing article in edit page
function adminShowArticleHandler(req, res, next) {
  let id = req.params.id;
  let sqlQuery = 'SELECT * From article WHERE id = $1';;
  
  dbExcecute(sqlQuery, [id])
    .then(data => {
      let = article = data[0];
      let categorySqlQuery = 'SELECT * FROM category;';

      dbExcecute(categorySqlQuery)
      .then(categories => {
        res.render('pages/admin/article', { categories: categories, article: article });
      })
      .catch(e => next(e));
    })
    .catch(e => next(e));
}

// handling update article
function adminUpdateArticleHandler(req, res, next) {
  let articleData = req.body;

  let sqlQuery = 'UPDATE article SET title=$1, image=$2, content=$3, category_id=$4 WHERE id =$5';
  let safeValues = [articleData.title, articleData.image, articleData.content, articleData.category, articleData.id];

  dbExcecute(sqlQuery, safeValues)
    .then(res.redirect('/admin/dashboard'))
    .catch(e => next(e));
}


/* --------- Application errors handler --------- */

function notFoundPageHandler(req, res, next) {
  res.status(401).send('Page Not Found');
}

// error handler
function errorHandler(error, req, res, next) {
  if(error){
    console.log(error);
    res.send('Somthing Bad Happned');
  } else {
    next();
  }
}

/* --------- Application start the server --------- */

client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    });
  })
  .catch((e) => console.log(e));
