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


// Service function to update an existing product
async function updateProduct(id, updatedData) {
    const products = await readFileWithDelay();
    
    // findIndex returns the position in the array (-1 if not found)
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    // Update fields using JavaScript spread operator
    products[index] = {
        ...products[index],
        name: updatedData.name !== undefined ? updatedData.name : products[index].name,
        price: updatedData.price !== undefined ? Number(updatedData.price) : products[index].price
    };

    await writeFile(products);
    return products[index];
}

// Service function to delete a product by ID
async function deleteProduct(id) {
    const products = await readFileWithDelay();
    
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    // .splice(index, 1) removes 1 item at the given index
    const [deletedItem] = products.splice(index, 1);
    
    await writeFile(products);
    return deletedItem;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};