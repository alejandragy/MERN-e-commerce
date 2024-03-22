import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager('src/data/products.json');

router.get('/', (req, res) => {
    res.render('index',
        {
            title: 'Una tienda de plantitas',
        });
});


router.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('products', 
        {
            title: 'Productos',
            style: 'products.css',
            products
        });
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', 
        {
            title: 'Productos en tiempo real',
            style: 'products.css',
            products
        });
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
});

export default router;