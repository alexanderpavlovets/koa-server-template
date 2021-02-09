const Router = require('koa-router');
const { rootController } = require('../controllers');

const rootRouter = new Router();

rootRouter.get('/', rootController);

module.exports = {
  rootRouter
};
