const {readFileWithDelay} = require('../database/db');

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

module.exports = {
    getAllProducts,
    getProductById
}