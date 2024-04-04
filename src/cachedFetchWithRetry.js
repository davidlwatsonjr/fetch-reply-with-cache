const memoryCache = {};

const DEFAULT_RETRY_OPTIONS = {
  retries: 5,
  retryDelay: (attempt) => Math.pow(2, attempt) * 500,
};

const DEFAULT_CACHE_LENGTH = 60;

const { FETCH_CACHE_TTL } = process.env;

const fetchCacheTTL = !isNaN(parseInt(FETCH_CACHE_TTL))
  ? parseInt(FETCH_CACHE_TTL)
  : DEFAULT_CACHE_LENGTH;

let fetchFn = global.fetch;
try {
  fetchFn = require("fetch-retry")(fetchFn);
} catch (err) {
  console.warn("fetch-retry is unavailable. Falling back to native fetch.");
}

const getCacheKey = (optionsObject) => {
  return require("crypto")
    .createHash("md5")
    .update(JSON.stringify(optionsObject))
    .digest("hex");
};

const getCachedResponse = (cacheKey) => {
  return memoryCache[cacheKey];
};

const setCachedResponse = (cacheKey, response) => {
  memoryCache[cacheKey] = response;
};

const deleteCachedResponse = (cacheKey) => {
  delete memoryCache[cacheKey];
};

const fetchAndCache = async (
  url,
  options,
  cacheKey,
  cacheTTL = fetchCacheTTL,
) => {
  const fetchResponse = await fetchFn(url, {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  });
  const responseText = await fetchResponse.text();
  setCachedResponse(cacheKey, responseText);
  setTimeout(() => {
    deleteCachedResponse(cacheKey);
  }, cacheTTL * 1000);

  return responseText;
};

const convertTextToPartialFetchReponse = (text) => ({
  ok: async () => Promise.resolve(true),
  text: async () => Promise.resolve(text),
  json: async () => Promise.resolve(JSON.parse(text)),
});

const fetch = async (url, options = {}) => {
  const { cacheTTL, ...fetchOptions } = options;

  const cacheKey = getCacheKey({ url, fetchOptions });

  const responseText =
    getCachedResponse(cacheKey) ||
    (await fetchAndCache(url, fetchOptions, cacheKey, cacheTTL));

  const response = convertTextToPartialFetchReponse(responseText);

  return Promise.resolve(response);
};

module.exports = { fetch };
