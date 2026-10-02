const express = require('express');
const productController = require('../controller/productController');
const {checkCache} = require('../middleware/cacheMiddleware');
const router = express.Router();


router.get('/', checkCache, productController.getProducts);
router.get('/:id',checkCache, productController.getProductById);

// (No checkCache middleware here because POST,PUT,DELETE,PATCH is a mutation!)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id', productController.patchProduct);


module.exports = router;
