// Application Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');
const { client } = require('./helpers/pgClient');
const { getDataFromAPI } = require('./helpers/superAgentClient');
const {Article}=require('./store');
const { dbExcecute } = require('./helpers/pgClient');
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

//Routes
app.get('/', homeHandler);


/* --------- Functions Handling routes --------- */

function homeHandler(req, res, next){
  let key=process.env.API_KEY;
  let worldURL=`https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${key}`;
  let artsURL=`https://api.nytimes.com/svc/topstories/v2/arts.json?api-key=${key}`;
  let scienceURL=`https://api.nytimes.com/svc/topstories/v2/science.json?api-key=${key}`;
  let healthURL=`https://api.nytimes.com/svc/topstories/v2/health.json?api-key=${key}`;
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

          getDataFromAPI(scienceURL)
            .then(scienceData=>{
              let scienceArray=scienceData.results.slice(0,5).map(item=>{
                return new Article({...item, section: scienceData.section });
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
                  
                });

            });
        })
        .catch((e) => next(e));
    });
}








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