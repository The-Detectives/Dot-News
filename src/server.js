// Application Dependencies
require('dotenv').config();
const express = require('express');
const router = express.Router();
const cors = require('cors');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const path = require('path');
const { client } = require('./helpers/pgClient');
const connectFlash = require('connect-flash')();

const { messagesMiddleware } = require('./middleWares');
const bootStrap = require('./routes');
const{ errorHandler } = require('./middleWares');

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

//Routes
bootStrap(app, router);

// error handler
app.use(errorHandler);



//Test Page (Home)
router.get('/test', (req, res, next) => {
  return res.send('Hello There');
});


/* --------- Application start the server --------- */

client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    });
  })
  .catch((e) => console.log(e));
