// Application Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const path = require('path');
const { client } = require('./helpers/pgClient');
const { getDataFromAPI } = require('./helpers/superAgentClient');
const { dbExcecute } = require('./helpers/pgClient');
const { Article } = require('./store');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const connectFlash = require('connect-flash')();
const expressMessages = require('express-messages');

/* ---------- Application Setups ---------- */

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(methodOverride('_method'));
app.use(connectFlash);
app.use(messagesMiddleware);
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
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
app.post('/aboutUs', contactHandler);
//Admin routes
app.get('/admin/login', loginPageHandler);
app.post('/admin/login', loginHandler);
app.get('/admin/logout', logutHandler);
app.get('/admin/dashboard', isAuthenticated, adminDashboardHandler);
app.get('/admin/article/new', isAuthenticated, adminNewArticleHandler);
app.post('/admin/article/new', isAuthenticated, adminCreateNewArticleHandler);
app.delete('/admin/article/:id', isAuthenticated, adminDeleteArticleHandler);
app.get('/admin/article/:id', isAuthenticated, adminShowArticleHandler);
app.put('/admin/article/:id', isAuthenticated, adminUpdateArticleHandler);
app.get('/admin/messages', isAuthenticated, adminMassagesHandler)

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
    .then((worldData) => {
      let worldArray = worldData.results.slice(0, 5).map((item) => {
        return new Article({ ...item, section: worldData.section });
      });

      getDataFromAPI(artsURL)
        .then((artsData) => {
          let artsArray = artsData.results.slice(0, 10).map((item) => {
            return new Article({ ...item, section: artsData.section });
          });

          getDataFromAPI(scienceURL)
            .then((scienceData) => {
              let scienceArray = scienceData.results.slice(0, 5).map((item) => {
                return new Article({ ...item, section: scienceData.section });
              });

              getDataFromAPI(healthURL)
                .then((healthData) => {
                  let healthArray = healthData.results
                    .slice(0, 5)
                    .map((item) => {
                      return new Article({
                        ...item,
                        section: healthData.section,
                      });
                    });

                  let SQL = 'SELECT * FROM article;';
                  dbExcecute(SQL)
                    .then((data) => {
                      let ourNews = data.slice(0, 10);
                      let categorySql = 'SELECT * FROM category;';
                      dbExcecute(categorySql)
                        .then(categories => {
                          res.render('index', {
                            worldNews: worldArray,
                            artsNews: artsArray,
                            scienceNews: scienceArray,
                            healthNews: healthArray,
                            ourNews: ourNews,
                            categories: categories,
                          });

                        })

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
function aboutUsHandler(req, res, next) {
  let categorySql = 'SELECT * FROM category;';
  dbExcecute(categorySql)
    .then(categories => {
      res.render('pages/aboutUs', { categories: categories });

    })
};

// Handling contact form
function contactHandler(req, res, next) {
  let contactData = req.body;
  let sqlContact = 'INSERT INTO contact (name, phone, email, message, date) VALUES ($1, $2, $3, $4, $5);';
  let safeValues1 = [contactData.username, contactData.phone, contactData.email, contactData.message, new Date()];
  dbExcecute(sqlContact, safeValues1)
    .then(res.redirect('/aboutUs'))
    .catch((e) => next(e));
}
// handling the article page
function articleHandler(req, res, next) {
  //article
  let SQL1 = `SELECT * From article JOIN category ON article.category_id = category.id WHERE article.id= $1;`;
  let safeValues1 = [req.params.id];

  dbExcecute(SQL1, safeValues1)
    .then((result) => {
      let article = result[0];
      let category = article.name;
      let CATEGORY_KEY = process.env.CATEGORY_KEY;
      let categoryUrl = `https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=${CATEGORY_KEY}`;
      getDataFromAPI(categoryUrl)
        .then((categoryData) => {
          let arr = categoryData.results.slice(0, 6).map((val) => {
            return new Article({ ...val, section: categoryData.section });
          });
          let categorySql = 'SELECT * FROM category;';
          dbExcecute(categorySql)
            .then(categories => {
              res.render('pages/article', {
                articleData: article,
                articleCategory: arr,
                categories: categories,
              })

            });
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
}

// handling the category Page
function categoryHandler(req, res, next) {
  let categoryName = req.params.category;
  if(categoryName === 'admin'){
    res.redirect('/admin/login');
  }
  
  let category_API_KEY = process.env.CATEGORY_KEY;
  let categoryUrl = `https://api.nytimes.com/svc/topstories/v2/${categoryName}.json?api-key=${category_API_KEY}`;

  getDataFromAPI(categoryUrl)
    .then((categoryData) => {
      let arr = categoryData.results.map((val) => {
        return new Article({ ...val, section: categoryData.section });
      });

      let categorySql = 'SELECT * FROM category;';

      dbExcecute(categorySql)
      .then(categories=>{

        let categoriesNames = categories.reduce((catNames, catObj) => {
          catNames.push(catObj.name);
          return catNames;
        }, []);

        if(!categoriesNames.includes(categoryName)){
          throw new Error('Page Not Found');
        }

        let sqlQuery =
        'SELECT * FROM category JOIN article ON article.category_id = category.id WHERE name = $1;';
      let safeValues = [categoryName];
      dbExcecute(sqlQuery, safeValues)
        .then((data) => {
          let resultDb = data;

          res.render('pages/category', {
            categoryApi: arr,
            categoryDB: resultDb,
            categories: categories,
          });
        })
        .catch((e) => next(e));
      });
    })
    .catch((e) => next(e));
}

/* --------- Admin Handling routes --------- */

// handling the login form page
function loginPageHandler(req, res, next) {
  authenticate(req)
    .then(auth => {
      if (auth) {
        res.redirect('/admin/dashboard');
      } else {
        res.render('pages/admin/login');
      }
    })

}

// handling login
function loginHandler(req, res, next) {
  const userReq = req.body;
  let user;

  let getUserQuery = 'SELECT * FROM users WHERE username=$1;';
  dbExcecute(getUserQuery, [userReq.username])
    .then((data) => {
      user = data[0];
      if (!user) {
        req.flash("error", "Username or password not correct");
        res.redirect('/admin/login');
      }
      return checkPassword(userReq.password, user);
    })
    .then((response) => createToken())
    .then((token) => {
      let getUserQuery =
        'UPDATE users SET token=$1 WHERE id=$2 RETURNING id, username, token;';

      return dbExcecute(getUserQuery, [token, user.id]).then(
        (data) => (user = data[0])
      );
    })
    .then(() => {
      delete user.password;
      req.session.user = user;
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
}

// handling logout
function logutHandler(req, res, next) {
  let sqlQuery = 'UPDATE users SET token=NULL WHERE username=$1';

  dbExcecute(sqlQuery, [req.session.user.username])
    .then(() => {
      req.session = null;
      res.redirect('/admin/login');
    })
    .catch(e => next(e));
}

// handling the admin dashboard page
function adminDashboardHandler(req, res, next) {
  let category_name = req.query.category ? req.query.category : '';
  let pageNumber = req.query.page ? parseInt(req.query.page) : 1;
  let limit = 5;
  let startWith = ((pageNumber - 1) * limit );

  let sqlQuery = 'SELECT * FROM article ORDER BY id DESC LIMIT $1 OFFSET $2;';
  let safeValues = [limit, startWith];
  if (req.query.category) {
    sqlQuery =
      'SELECT * FROM category JOIN article ON article.category_id = category.id WHERE name = $1 ORDER BY article.id DESC LIMIT $2 OFFSET $3;';
      safeValues = [category_name, limit, startWith];
    }

  dbExcecute(sqlQuery, safeValues)
    .then((articles) => {
      let categorySqlQuery = 'SELECT * FROM category;';
      dbExcecute(categorySqlQuery)
        .then((categories) => {
          let sqlCountAllQuery = 'SELECT COUNT(*) FROM article;';
          dbExcecute(sqlCountAllQuery)
          .then(countData => {
            let hasNext = parseInt(countData[0].count) > startWith + limit;

            res.render('pages/admin/dashboard', {
              articles: articles,
              categories: categories,
              pageNumber: pageNumber,
              category_name: category_name,
              hasNext:hasNext
            });
          })
          
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
}

// handling the add new article page
function adminNewArticleHandler(req, res, next) {
  let categorySqlQuery = 'SELECT * FROM category';

  dbExcecute(categorySqlQuery)
    .then((categories) => {
      res.render('pages/admin/article', {
        categories: categories,
        article: {},
      });
    })
    .catch((e) => next(e));
}

// handling creating new article
function adminCreateNewArticleHandler(req, res, next) {
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
      req.flash("info", "Article Added successfully");
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
}

// handling delete article
function adminDeleteArticleHandler(req, res, next) {
  let articleId = req.params.id;
  let sqlQuery = 'DELETE FROM article WHERE id = $1;';

  dbExcecute(sqlQuery, [articleId])
    .then(() => {
      req.flash("info", "Article Deleted successfully");
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
}

// handling showing article in edit page
function adminShowArticleHandler(req, res, next) {
  let id = req.params.id;
  let sqlQuery = 'SELECT * From article WHERE id = $1';

  dbExcecute(sqlQuery, [id])
    .then((data) => {
      let = article = data[0];
      let categorySqlQuery = 'SELECT * FROM category;';

      dbExcecute(categorySqlQuery)
        .then((categories) => {
          res.render('pages/admin/article', {
            categories: categories,
            article: article,
          });
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
}

// handling update article
function adminUpdateArticleHandler(req, res, next) {
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
      req.flash("info", "Article updated successfully");
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
}

// handling contact message
function adminMassagesHandler(req, res, next) {
  let contactSql = 'SELECT * FROM contact';

  dbExcecute(contactSql)
    .then((messages) => {
      let categorySqlQuery = 'SELECT * FROM category;';
      dbExcecute(categorySqlQuery)
        .then((categories) => {
          res.render('pages/admin/dashboardmessages', { messages: messages, categories: categories, category_name: '' });
        })
        .catch(e => next(e));
    })
    .catch((e) => next(e));

}
/* --------- Application errors handler --------- */

function notFoundPageHandler(req, res, next) {
  let categorySql = 'SELECT * FROM category;';
  dbExcecute(categorySql)
    .then(categories => {
      res.status(401).render('pages/error', { categories: categories });
    })
    .catch((e) => next(e));

}

// error handler
function errorHandler(error, req, res, next) {
  if (error) {
    console.log(error);
    if(error.message === 'Password do not match'){
      req.flash("error", "Username or password not correct");
      res.redirect('/admin/login');
    }
    notFoundPageHandler(req, res, next);
  } else {
    next();
  }
}

/* helper functions for authentication */

// function to check password
function checkPassword(reqPassword, foundUser) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(reqPassword, foundUser.password, (err, response) => {
      if (err) {
        reject(err);
      } else if (response) {
        resolve(response);
      } else {
        reject(new Error('Password do not match'));
      }
    });
  });
}

// function to generate random token
function createToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'));
    });
  });
}

// function to check if the user is authenticated
function authenticate(userReq) {
  let token = userReq.session.user ? userReq.session.user.token : null;
  return findByToken(token).then((user) => {
    if (user && user.username == userReq.session.user.username) {
      return true;
    } else {
      return false;
    }
  })
    .catch((e) => {
      throw new Error(e);
    });
}

// function to get user by token
function findByToken(token) {
  let sqlQuery = 'SELECT * FROM users WHERE token=$1';
  return dbExcecute(sqlQuery, [token])
    .then((data) => {
      return data[0];
    })
    .catch((e) => {
      throw new Error(e);
    });
}

// Messages middleware
function messagesMiddleware(req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
}

// authentication middleware
function isAuthenticated(req, res, next) {
  authenticate(req)
    .then(auth => {
      if (!auth) {
        res.redirect('/admin/login');
      } else {
        next();
      }
    })
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
