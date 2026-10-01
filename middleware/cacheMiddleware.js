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
            return res.json(value);
        }
        else {
            console.log(`[CACHE EXPIRED] Entry for ${key} is older than 1 minute. Evicting...`);
            delete cache[key]; // Remove the stale entry from memory
        }
    }

    console.log(`[CACHE MISS] Fetching fresh data for: ${key}`);
    next();
}

module.exports = {
    cache,
    checkCache
}