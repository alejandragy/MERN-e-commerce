import { Router } from 'express';
import CartsManager from '../dao/CartsManager.js';
import ProductManager from '../dao/ProductManager.js';

const router = Router();
const cartManager = new CartsManager();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        return res.status(200).send(carts);
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

router.get('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart  = await cartManager.getCartById(cartId);
        return res.status(200).send(cart);  
    } catch (error) {
       return res.status(500).send({ error: 'Error interno del servidor' })
    }
});

router.post('/', async (req, res) => {
    try {
        await cartManager.createCart();
        return res.status(201).send({ message: 'Carrito creado' });
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

router.post('/:cartId/product/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await cartManager.getCartById(cartId);

        const productId = req.params.productId;
        const productToAdd = await productManager.getProductById(productId);

        if (!productToAdd){
            return res.status(400).send({error: 'No existe el producto'});
        }
        if (!cart){
            return res.status(400).send({error: 'No existe el carrito'});
        }

        await cartManager.addProductToCart(cart, productToAdd);
        return res.status(200).send({message: 'Producto añadido al carrito'});

    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

router.delete('/:cartId/product/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await cartManager.getCartById(cartId);

        const productId = req.params.productId;
        const productToDelete = await productManager.getProductById(productId);

        await cartManager.deleteProductInCart(cart, productToDelete);

    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});



export default router;