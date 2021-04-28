const { getDataFromAPI } = require('../../helpers/superAgentClient');
const { getCategories } = require('../../models/categoryModel');
const { getArticles } = require('../../models/articleModel');
const { Article } = require('../../store');

// handling the home page
module.exports = async (req, res, next) => {
  let key = process.env.CATEGORY_KEY;

  let worldURL = `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${key}`;
  let artsURL = `https://api.nytimes.com/svc/topstories/v2/arts.json?api-key=${key}`;
  let scienceURL = `https://api.nytimes.com/svc/topstories/v2/science.json?api-key=${key}`;
  let healthURL = `https://api.nytimes.com/svc/topstories/v2/health.json?api-key=${key}`;

  try {
    let worldData = await getDataFromAPI(worldURL);
    let worldArray = worldData.results.slice(0, 5).map((item) => {
      return new Article({ ...item, section: worldData.section });
    });

    let artsData = await getDataFromAPI(artsURL);
    let artsArray = artsData.results.slice(0, 10).map((item) => {
      return new Article({ ...item, section: artsData.section });
    });

    let scienceData = await getDataFromAPI(scienceURL);
    let scienceArray = scienceData.results.slice(0, 5).map((item) => {
      return new Article({ ...item, section: scienceData.section });
    });

    let healthData = await getDataFromAPI(healthURL);
    let healthArray = healthData.results.slice(0, 5).map((item) => {
      return new Article({
        ...item,
        section: healthData.section,
      });
    });

    let ourNews = await getArticles();

    let categories = await getCategories();

    res.render('index', {
      worldNews: worldArray,
      artsNews: artsArray,
      scienceNews: scienceArray,
      healthNews: healthArray,
      ourNews: ourNews,
      categories: categories,
    });
  } catch (e) {
    next(e);
  }
};
