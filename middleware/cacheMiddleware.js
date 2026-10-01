const cache = {};

async function checkCache(req,res,next){
    let key = req.originalUrl;
    let value = cache[key];
    if(value){
        console.log(`[CACHE HIT] Serving from cache for: ${key}`);
        res.set('X-Cache','HIT');
        return res.json(value);
    }

    console.log(`[CACHE MISS] Fetching fresh data for: ${key}`);
    next();
}

module.exports = {
    cache,
    checkCache
}