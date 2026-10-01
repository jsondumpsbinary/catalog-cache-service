
const express = require('express');
const { readFileWithDelay } = require('./database/db');
const app = express();

const port = 3000;

const cache = {}


app.get('/products', async (req, res) => {
    try{
        let key = req.url
        let value = cache[key]
        console.log("--> Request for URL:", key);
        console.log("--> Current Cache Keys:", Object.keys(cache));
        if(value){ //no need to read from the db
            return res.json(value)
        }

        let products = await readFileWithDelay()
        cache[key] = products
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