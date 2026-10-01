const fs = require('fs/promises');
const path = require('path');


const pathToDB = path.join(__dirname, "../db.json");

async function readFile() {
    try {
        let data = await fs.readFile(pathToDB, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.log(err);
    }
}

async function readFileWithDelay() {
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 1500);
    });
    let products = await readFile();
    return products;
}

// We must export this so Server.js can use it
module.exports = {
    readFileWithDelay
};