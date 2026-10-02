const {readFileWithDelay,writeFile} = require('../database/db');

async function getAllProducts(){
    const products = await readFileWithDelay();
    return products;
}


async function getProductById(id){
    const products = await readFileWithDelay();
    const product = products.find((item_obj) =>{
        return item_obj.id === id;
    });

    return product;
}

// Service function to add a new product
async function createProduct(productData) {
    const products = await readFileWithDelay();
    
    // Auto-generate a new ID (highest existing ID + 1)
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        id: newId,
        name: productData.name,
        price: productData.price
    };
    
    products.push(newProduct);
    await writeFile(products);
    
    return newProduct;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct
}