const express = require('express');
const fs = require('fs/promises')
const path = require('path')
const app = express();
const port = 3000;
const pathToFile = path.join(__dirname,"db.json")


async function readFile(){
    let data = await fs.readFile(pathToFile,'utf-8')
    return JSON.parse(data)

}

app.get('/products', async (req, res) => {
    let products = await readFile()
    console.log(products)
    res.send(products)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});