import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js';

import auth from '../middlewares/auth.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', (req, res) => {
    res.render('index',
        {
            title: 'Una tienda de plantitas',
            notUser: req.session.user ? false : true,
            user: req.session.user,
        });
});

router.get('/register', async (req, res) => {
    try{
        res.render('register',
        {
            title: 'Registro',
            style: 'register.css',
            failRegister: req.session.failRegister ?? false,
            notUser: req.session.user ? false : true,
            user: req.session.user,
        });
    } catch (error) {
        return res.redirect('/register');
    }
});

router.get('/login', async (req, res) => {
    try{
        res.render('login',
        {
            title: 'Iniciar Sesión',
            style: 'login.css',
            failLogin: req.session.failLogin ?? false,
            notUser: req.session.user ? false : true,
            user: req.session.user,
        });
    }catch (error){
        req.session.failLogin = true;
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
});

router.get('/logout', async (req, res) => {
    try{
        req.session.destroy(error => {
            if (!error) {
                return res.redirect('/');;
            }
            res.send({
                status: 'Logout ERROR',
                body: error,
            });
        });
    }catch (error){
        req.session.failLogin = true;
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
    });


router.get('/products', async (req, res) => {
    try {
        const baseURL = 'http://localhost:8080/products';
        const limit = parseInt(req.query.limit); 
        const page = parseInt(req.query.page);
        const sort = req.query.sort;
        const filter = {};
        if (req.query.title) filter.title = req.query.title;
        if (req.query.code) filter.code = req.query.code;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.price) filter.price = req.query.price;
        
        const productsData = await productManager.getProducts(limit, filter, page, sort);

        //url de paginado
        let prevLinkURL = `${baseURL}${productsData.prevLink}`;
        let nextLinkURL = `${baseURL}${productsData.nextLink}`
        if (filter.category != undefined ){
            prevLinkURL += `&category=${filter.category}`;
            nextLinkURL +=`&category=${filter.category}`;
        }
        if (limit){
            prevLinkURL += `&limit=${limit}`;
            nextLinkURL += `&limit=${limit}`;
        } 
        if (sort){
            prevLinkURL += `&sort=${sort}`;
            nextLinkURL += `&sort=${sort}`
        }
        
        
        res.render('products', 
        {
            title: 'Productos',
            style: 'products.css',
            products: productsData.payload,
            prevLink: prevLinkURL,
            nextLink: nextLinkURL,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            isValid: !(productsData.page <= 0 || productsData.page > productsData.totalPages),
            currentLimit: limit,
            notUser: req.session.user ? false : true,
            user: req.session.user,
        });

    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
});

router.get('/realtimeproducts', auth, async (req, res) => {
    try {
        const baseURL = 'http://localhost:8080/realtimeproducts';
        const page = parseInt(req.query.page);
        const productsData = await productManager.getProductsRealTime(page);
        console.log(productsData);

        res.render('realTimeProducts', 
        {
            title: 'Productos en tiempo real',
            style: 'products.css',
            products: productsData.payload,
            prevLink: `${baseURL}${productsData.prevLink}`,
            nextLink: `${baseURL}${productsData.nextLink}`,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            isValid: !(productsData.page <= 0 || productsData.page > productsData.totalPages),
            notUser: req.session.user ? false : true,
            user: req.session.user,
        });
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
});

export default router;