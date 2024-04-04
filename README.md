# fetch-retry-with-cache

This project adds retry functionality (using `fetch-retry`) and memory caching functionality to the native Node `fetch` function.

## Usage

```js
const { fetch } = require("@davidlwatsonjr/fetch-retry-with-cache");

...

await fetch(url, options); // This should be no different than the native fetch syntax except you're able to add `fetch-retry` options and some caching options (`cacheTTL`, for example).
```

For the `fetch-retry` functionality to work, you must install `fetch-retry` separately. If you don't, this will work anyway, but without retry functionality and just the memory caching.

## Cache TTL

This module defaults to a 60 second cache. To use a different TTL, set an environment variable of `FETCH_CACHE_TTL` to the number of seconds you'd like to cache.

You can also set a TTL per request by including a `cacheTTL` property in the `options` object to `fetch`.

```js
await fetch(url, { cacheTTL: 3600, ...options });
```
