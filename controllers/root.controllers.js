const { rootService } = require('../services');

async function rootController(ctx) {
  const payload = await rootService();
  ctx.status = 200;
  ctx.body = {
    payload
  };
}

module.exports = {
  rootController
};
