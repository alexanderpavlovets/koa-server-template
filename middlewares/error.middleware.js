const { logger } = require('../utils/logger');

async function serverErrorMiddleware(ctx, next) {
  try {
    await next();
  } catch (error) {
    logger.error(`Error! Message is: ${error.message}`);
    ctx.status = error.status || 500;
    ctx.body = {
      error: true,
      message: error.message,
      stack: error.stack
    };
  }
}

async function notFoundErrorMiddleware(ctx) {
  const error = new Error(`Provided path ${ctx.originalUrl} not found. Double check your method also.`);
  error.status = 404;
  ctx.throw(error);
}

module.exports = {
  serverErrorMiddleware, notFoundErrorMiddleware
};
