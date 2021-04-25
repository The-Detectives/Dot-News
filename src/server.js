// Application Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const path = require('path');
const { client } = require('./helpers/pgClient');
const connectFlash = require('connect-flash')();

const { messagesMiddleware } = require('./middleWares');

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
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

//Test Page (Home)
app.get('/test', (req, res, next) => {
  return res.send('Hello There');
});

//Routes
app.get('/', homeHandler);
app.get('/aboutUs', aboutUsHandler);
app.get('/contactUs', contactPageRender);
app.post('/contactUs', contactHandler);
app.get('/article/:id', articleHandler);
app.get('/:category', categoryHandler);

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


/* --------- Application start the server --------- */

client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    });
  })
  .catch((e) => console.log(e));
