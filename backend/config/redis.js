const inMemoryCache = new Map();

const cacheClient = {
  async get(key) {
    const item = inMemoryCache.get(key);
    if (item && item.expiry > Date.now()) {
      return item.value;
    }
    if (item) {
      inMemoryCache.delete(key);
    }
    return null;
  },

  async setEx(key, ttl, value) {
    inMemoryCache.set(key, {
      value,
      expiry: Date.now() + ttl * 1000
    });
  }
};

module.exports = cacheClient;