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

async function writeFile(data) {
    try {
        await fs.writeFile(pathToDB, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.log(err);
    }
}
// We must export this so Server.js can use it
module.exports = {
    readFileWithDelay,
    writeFile
};