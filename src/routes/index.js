const mainSiteRoutes = require('./mainSiteRoutes');
const adminRoutes = require('./adminRoutes');

module.exports = (app, router) => {
  //Initialize Routes
  app.use(router);
  mainSiteRoutes(router);
};
