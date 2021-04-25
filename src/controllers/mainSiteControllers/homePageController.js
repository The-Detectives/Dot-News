const { getDataFromAPI } = require('../../helpers/superAgentClient');
const { dbExcecute } = require('../../helpers/pgClient');

// handling the home page
module.exports = function homePageController(req, res, next) {
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
  
                    let SQL = 'SELECT * FROM article ORDER BY id DESC LIMIT 10 OFFSET 0;';
                    dbExcecute(SQL)
                      .then((data) => {
                        let ourNews = data;
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