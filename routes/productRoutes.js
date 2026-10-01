const express = require('express');
const productController = require('../controller/productController');
const {checkCache} = require('../middleware/cacheMiddleware');
const router = express.Router();


router.get('/', checkCache, productController.getProducts);
router.get('/:id',checkCache, productController.getProductById);

module.exports = router;
