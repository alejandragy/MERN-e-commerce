import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const PORT = 8080; 

const manager = new ProductManager(`products.json`); 


app.get('/products', async (req, res) => {
    let products = await manager.getProducts();
    const {limit} = req.query;

    if(limit){
        products = products.slice(0, limit);
    }

    res.send(products);
});

app.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId;

    let product = await manager.getProductById(productId);

    product ? res.send(product) : console.error('Producto no encontrado');

})


app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
})