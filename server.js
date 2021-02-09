const Koa = require('koa');
const { config } = require('./config');
const { logger } = require('./utils');
const {
  serverErrorMiddleware,
  notFoundErrorMiddleware,
  requestsLoggerMiddleware
} = require('./middlewares');
const { rootRouter } = require('./routes');

const app = new Koa();

app.use(requestsLoggerMiddleware);
app.use(serverErrorMiddleware);

app.use(rootRouter.routes());

app.use(notFoundErrorMiddleware);

app.listen(config.env.PORT);
logger.info(`Server is up and running on port ${config.env.PORT}`);

process.on('SIGINT', () => {
  logger.fatal('Shutting down the server');
  process.exit();
});
