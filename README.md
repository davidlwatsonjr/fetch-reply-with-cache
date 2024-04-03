# fetch-retry-with-cache

This project adds retry functionality (using `fetch-retry`) and memory caching functionality to the native Node `fetch` function.

## Usage

```js
const { fetch } = require("@davidlwatsonjr/fetch-retry-with-cache");

...

await fetch(url, options); // This should be no different than the native fetch syntax except you're able to add `fetch-retry` options and some caching options (`cacheTTL`, for example).
```

For the `fetch-retry` functionality to work, you must install `fetch-retry` separately. If you don't, this will work anyway, but without retry functionality and just the memory caching.
