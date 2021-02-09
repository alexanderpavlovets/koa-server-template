const { serverErrorMiddleware, notFoundErrorMiddleware } = require('./error.middleware');
const { requestsLoggerMiddleware } = require('./requests.logger.middleware');

module.exports = {
  serverErrorMiddleware,
  notFoundErrorMiddleware,
  requestsLoggerMiddleware
};
