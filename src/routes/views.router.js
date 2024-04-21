import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get('/', (req, res) => {
    res.render('index',
        {
            title: 'Una tienda de plantitas',
        });
});


router.get('/products', async (req, res) => {
    try {
        const baseURL = 'http://localhost:8080/products';
        const limit = parseInt(req.query.limit); 
        const page = parseInt(req.query.page);
        const filter = {};
        if (req.query.title) filter.title = req.query.title;
        if (req.query.code) filter.code = req.query.code;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.price) filter.price = req.query.price;
        const sort = req.query.sort;
        
        const productsData = await productManager.getProducts(limit, filter, page, sort);

        console.log(productsData); //pruebita
        
        
        res.render('products', 
        {
            title: 'Productos',
            style: 'products.css',
            products: productsData.payload,
            prevLink: `${baseURL}${productsData.prevLink}&limit=${limit}`,
            nextLink: `${baseURL}${productsData.nextLink}&limit=${limit}`,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            isValid: !(productsData.page <= 0 || productsData.page > productsData.totalPages),
            currentLimit: limit
        });

    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const baseURL = 'http://localhost:8080/realtimeproducts';
        const limit = parseInt(req.query.limit); 
        const page = parseInt(req.query.page);
        const filter = {};
        if (req.query.title) filter.title = req.query.title;
        if (req.query.code) filter.code = req.query.code;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.price) filter.price = req.query.price;

        const productsData = await productManager.getProducts(limit, filter, page);

        res.render('realTimeProducts', 
        {
            title: 'Productos en tiempo real',
            style: 'products.css',
            products: productsData.payload,
            prevLink: `${baseURL}${productsData.prevLink}&limit=${limit}`,
            nextLink: `${baseURL}${productsData.nextLink}&limit=${limit}`,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            isValid: !(productsData.page <= 0 || productsData.page > productsData.totalPages),
            currentLimit: limit,
        });
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
});

export default router;