const productService = require('../services/productService');
const {cache} = require('../middleware/cacheMiddleware');

async function getProducts(req,res){
    try{
        let key = req.originalUrl;
        let products = await productService.getAllProducts();
        cache[key] = {
            value : products,
            createdAt : Date.now()
        };
        res.set('X-Cache','MISS');
        return res.json(products);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getProductById(req,res){
    try{
        let key = req.originalUrl;
        let {id} = req.params;
        let product = await productService.getProductById(Number(id));
        res.set('X-Cache','MISS');
        if(!product){
            return res.status(404).json({ error: "Product not found" });
        }
        cache[key] = {
            value: product,
            createdAt: Date.now()
        };
        return res.json(product);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getProducts,
    getProductById
}