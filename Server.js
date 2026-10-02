const express = require('express');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorMiddleware');



const app = express();

const port = 3000;

app.use(express.json());
app.use('/products',productRoutes);
app.use(errorHandler);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});