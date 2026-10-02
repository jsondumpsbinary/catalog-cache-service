const productService = require('../services/productService');
const {cache,clearCache} = require('../middleware/cacheMiddleware');

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

async function createProduct(req, res) {
    try {
        const { name, price } = req.body;
        
        // Basic validation
        if (!name || !price) {
            return res.status(400).json({ error: "Name and price are required" });
        }
        
        const newProduct = await productService.createProduct({ name, price: Number(price) });
        
        // CACHE INVALIDATION: Data changed, wipe stale cache!
        clearCache();
        
        // Return 201 Created status
        res.status(201).json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        const updated = await productService.updateProduct(Number(id), { name, price });
        
        if (!updated) {
            return res.status(404).json({ error: "Product not found" });
        }

        // CACHE INVALIDATION: Purge stale product listings & item caches
        clearCache();

        res.json(updated);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        const deleted = await productService.deleteProduct(Number(id));
        
        if (!deleted) {
            return res.status(404).json({ error: "Product not found" });
        }

        // CACHE INVALIDATION: Purge stale cache entries
        clearCache();

        res.json({ message: "Product deleted successfully", product: deleted });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
