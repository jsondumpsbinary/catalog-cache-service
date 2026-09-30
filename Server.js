const { channel } = require('diagnostics_channel');
const express = require('express');
const fs = require('fs/promises')
const path = require('path')
const app = express();
const port = 3000;
const pathToFile = path.join(__dirname,"db.json")

const cache = {}

async function readFile(){
    try{
        let data = await fs.readFile(pathToFile,'utf-8')
        return JSON.parse(data)
    }
    catch(err){
        console.log(err)
    }

}

async function readFileWithDelay(){
    await new Promise((resolve,reject)=>{
        setTimeout(resolve,1500)
    })
    let products = await readFile()
    return products
}

app.get('/products', async (req, res) => {
    try{
        let key = req.url
        let value = cache[key]
        if(value){ //no need to read from the db
            return res.json(value)
        }

        let products = await readFileWithDelay()
        cache[key] = products
        console.log(cache)
        res.send(products)
    }
    catch(err){
        console.log(err)
    }
});

app.get('/products/:id', async (req, res) => {
    try{
        let key = req.url
        let value = cache[key]
        if(value){ //no need to read from the db
            return res.json(value)
        }

        let products = await readFileWithDelay()
        let {id} = req.params
        id = Number(id)
        let product = products.find((item)=>{
            cache[key] = item
            return item.id === id
        })
        res.json(product)
    }
    catch(err){
        console.log(err)
    }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});