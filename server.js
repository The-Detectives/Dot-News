// Application Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');
const { client } = require('./helpers/pgClient');
const { getDataFromAPI } = require('./helpers/superAgentClient');

/* ---------- Application Setups ---------- */

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('./src/public'));
app.use(express.urlencoded({ extended: true }));

/* --------- Application start the server --------- */

//Test Page (Home)
app.get('/test', (req, res, next) => {
  return res.send('Hello There');
});

client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    });
  })
  .catch((e) => console.log(e));


//Category Page
app.get('/:category', (req,res) => {

  let categoryName = req.params.category;
  let category_API_KEY = process.env.CATEGORY_KEY;
  let categoryUrl = `https://api.nytimes.com/svc/topstories/v2/${categoryName}.json?api-key=${category_API_KEY}`;

  getDataFromAPI (categoryUrl)
    .then(categoryData => {

      let arr = categoryData.results.map((val) => {
        return new Article({...val, section: categoryData.section });
      });
      res.send(arr);
    })
    .catch(error => {
      res.send(error);
    });
});