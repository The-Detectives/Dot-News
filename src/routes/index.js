const mainSiteRoutes = require('./mainSiteRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const { notFoundPageController } = require('../controllers')

module.exports = (app, router) => {
  //Initialize Routes
  mainSiteRoutes(router);
  authRoutes(router);
  adminRoutes(router);

  router.get('*', notFoundPageController);
};
