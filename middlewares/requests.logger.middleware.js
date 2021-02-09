const { logger } = require('../utils/logger');

async function requestsLoggerMiddleware(ctx, next) {
  logger.info(`Got request: ${ctx.request.method}: ${ctx.originalUrl}`);
  await next();
  logger.info(`Returning response with status: ${ctx.status}`);
}

module.exports = {
  requestsLoggerMiddleware
};
