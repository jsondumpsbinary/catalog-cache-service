const productService = require('../services/productService');

const cache = {};

async function getProducts(req,res){
    try{
        let key = req.url;
        let value = cache[key];
        if(value){
            return res.json(value);
        }
        let products = await productService.getAllProducts();
        cache[key] = products;
        return res.json(products)
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getProductById(req,res){
    try{
        let key = req.url;
        let value = cache[key];
        if(value){
            return res.json(value);
        }

        let {id} = req.params
        let product = await productService.getProductById(Number(id))
        if(!product){
            return res.status(404).json({ error: "Product not found" });
        }
        cache[key] = product;
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