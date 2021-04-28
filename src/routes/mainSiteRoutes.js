//Get Controllers
const { mainSiteControllers } = require('../controllers');

module.exports = (router) => {
  router.get('/', mainSiteControllers.homePageController);
  router.get('/aboutUs', mainSiteControllers.aboutusPageController);
  router.get('/contactUs', mainSiteControllers.contactusPageController);
  router.post('/contactUs', mainSiteControllers.contactusFormController);
  router.get('/article/:id', mainSiteControllers.articlePageController);
  router.get('/:category', mainSiteControllers.categoryPageController);
};
