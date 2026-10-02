const productService = require('../services/productService');
const { cache, clearCache } = require('../middleware/cacheMiddleware');

async function getProducts(req, res, next) { // Added next parameter
    try {
        let key = req.originalUrl;
        let products = await productService.getAllProducts(); 
        
        cache[key] = { value: products, createdAt: Date.now() };
        res.set('X-Cache', 'MISS');
        res.json(products);
    } catch (err) {
        next(err); // Pass error to global error handler
    }
}

async function getProductById(req, res, next) { // Added next parameter
    try {
        let key = req.originalUrl;
        let { id } = req.params;
        
        let product = await productService.getProductById(Number(id));
        
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        cache[key] = { value: product, createdAt: Date.now() };
        res.set('X-Cache', 'MISS');
        res.json(product);
    } catch (err) {
        next(err); // Pass error to global error handler
    }
}

async function createProduct(req, res, next) {
    try {
        const { name, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ error: "Name and price are required" });
        }
        
        const newProduct = await productService.createProduct({ name, price: Number(price) });
        clearCache();
        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
}

async function updateProduct(req, res, next) {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        const updated = await productService.updateProduct(Number(id), { name, price });
        if (!updated) {
            return res.status(404).json({ error: "Product not found" });
        }

        clearCache();
        res.json(updated);
    } catch (err) {
        next(err);
    }
}

async function deleteProduct(req, res, next) {
    try {
        const { id } = req.params;

        const deleted = await productService.deleteProduct(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Product not found" });
        }

        clearCache();
        res.json({ message: "Product deleted successfully", product: deleted });
    } catch (err) {
        next(err);
    }
}

async function patchProduct(req, res, next) {
    try {
        const { id } = req.params;
        const updated = await productService.patchProduct(Number(id), req.body);
        
        if (!updated) {
            return res.status(404).json({ error: "Product not found" });
        }

        clearCache(); // Invalidate cache on PATCH mutation
        res.json(updated);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    patchProduct
};