const cache = {};
const ttlInMs = 60*1000;
async function checkCache(req,res,next){
    let key = req.originalUrl;
    let value = cache[key];
    if(value){
        let now = Date.now();
        let timeElapsed = now - value.createdAt;
        if(timeElapsed<ttlInMs){
            console.log(`[CACHE HIT] Serving from cache for: ${key}`);
            res.set('X-Cache','HIT');
            return res.json(value.value);
        }
        else {
            console.log(`[CACHE EXPIRED] Entry for ${key} is older than 1 minute. Evicting...`);
            delete cache[key]; // Remove the stale entry from memory
        }
    }

    console.log(`[CACHE MISS] Fetching fresh data for: ${key}`);
    next();
}

function clearCache() {
    console.log('[CACHE INVALIDATED] Wiping all cache entries due to data mutation!');
    // Delete every key in the cache object
    for (let key in cache) {
        delete cache[key];
    }
}

module.exports = {
    cache,
    checkCache,
    clearCache
}