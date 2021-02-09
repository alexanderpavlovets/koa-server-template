const querystring = require('querystring');
const url = require('url');
const { logger } = require('../logger');

const sleep = async (ms = 1000) => new Promise((res) => setTimeout(res, ms));

function formRequestUrl(requestUrlData) {
  let { host, path, queries } = requestUrlData; // eslint-disable-line
  if (queries) {
    queries = `?${querystring.stringify(queries)}`;
    path = `${path}${queries}`;
  }

  return url.resolve(host, path);
}

function formRequestHeaders(requestHeadersData) {
  // TODO if required
  return requestHeadersData;
}

function formRequestBody({ body, method }) {
  return method === 'POST' ? JSON.stringify(body) : body;
}

async function retry({ fn, retryIt, requestUrl }) {
  const retrySettings = {
    attempts: 3,
    statusCodes: [504],
    intervalMs: 1000,
  };

  let result = await fn();

  if (retryIt && retrySettings.statusCodes.includes(result.status)) {
    logger.error(`Oops! We got ${result.status} for ${requestUrl}. Retrying`);

    for (let i = 1; i < retrySettings.attempts + 1; i += 1) {
      logger.info(`Retry attempt ${i} for ${requestUrl} started`);
      await sleep(retrySettings.intervalMs);

      const retryRes = await fn();
      if (!retrySettings.statusCodes.includes(retryRes.status)) {
        logger.info(`Retry attempt ${i} is successfull for ${requestUrl}`);
        return retryRes;
      }

      logger.error(`Retry attempt ${i} is failed for ${requestUrl}. Got ${retryRes.status} status code`);
      result = retryRes;
    }
  }

  return result;
}

module.exports = {
  formRequestUrl,
  formRequestHeaders,
  formRequestBody,
  sleep,
  retry
};
