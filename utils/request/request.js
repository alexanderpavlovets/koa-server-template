const fetch = require('node-fetch');
const {
  formRequestUrl,
  formRequestHeaders,
  formRequestBody,
  sleep,
  retry
} = require('./request-utils');

/**
 *
 * @param {string} host - host
 * @param {string} method - http method
 * @param {object} requestData - request data
 * @param {string} requestData.path - path to the resource
 * @param {object} requestData.body - body of the request
 * @param {object} requestData.headers - headers of the request
 * @param {object} requestData.queries - queries of the request in format {name: value}
 */
async function fetchWrapper(host, method, requestData = {}) {
  const {
    path, body = null, headers = {}, queries, retryIt = false, isSleepNeededBeforeRequest = false,
  } = requestData;

  const requestUrl = formRequestUrl({
    host,
    path,
    queries,
  });
  const requestHeaders = formRequestHeaders(headers);
  const requestBody = formRequestBody({ body, method });

  async function executeRequest() {
    let responseData;
    // eslint-disable-next-line no-useless-catch
    try {
      if (isSleepNeededBeforeRequest) await sleep(1000);
      responseData = await fetch(requestUrl, {
        method,
        headers: requestHeaders,
        body: requestBody,
        timeout: 120 * 1000, // big request timeout in order to catch 504s error
      });
    } catch (error) {
      // If smth really bad happens - we should see it as it is.
      // In case request works, but returns errors (502,504, etc.) - pls handle with retry
      throw error;
    }

    let responseBodyFormat;
    // "content-type" is absent in headers in case of 401 error
    if (responseData.headers.get('content-type')) {
      responseBodyFormat = responseData.headers.get('content-type').includes('application/json') ? 'json' : 'text';
    } else {
      responseBodyFormat = 'text';
    }

    return {
      status: responseData.status,
      headers: responseData.headers.raw(),
      body: await responseData[responseBodyFormat](),
    };
  }

  return retry({ fn: executeRequest, retryIt, requestUrl });
}

function request(host) {
  return {
    get: fetchWrapper.bind(fetchWrapper, host, 'GET'),
    post: fetchWrapper.bind(fetchWrapper, host, 'POST'),
    put: fetchWrapper.bind(fetchWrapper, host, 'PUT'),
    patch: fetchWrapper.bind(fetchWrapper, host, 'PATCH'),
    delete: fetchWrapper.bind(fetchWrapper, host, 'DELETE'),
  };
}

module.exports = {
  request,
};
