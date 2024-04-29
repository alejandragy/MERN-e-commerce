import { Router } from 'express';
import CartManager from '../dao/CartManager.js';
import ProductManager from '../dao/ProductManager.js';

const router = Router();
const cartManager = new CartManager();
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
        const productId = req.params.productId;

        if (!productId){
            return res.status(400).send({error: 'No existe el producto'});
        }
        if (!cartId){
            return res.status(400).send({error: 'No existe el carrito'});
        }

        await cartManager.addProductToCart(cartId, productId);
        return res.status(200).send({message: 'Producto añadido al carrito'});

    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

router.put('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const products = req.body.products;

        await cartManager.updateCart(cartId, products);
        return res.status(200).send({message: 'Carrito actualizado'});

    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

router.put('/:cartId/product/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const quantity = req.body.quantity;

        await cartManager.updateQuantity(cartId, productId, quantity);
        return res.status(200).send({message: 'Cantidad actualizada'});

    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});



router.delete('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        await cartManager.deleteAllProductsFromCart(cartId);
        return res.status(200).send({message: 'Carrito Vaciado'});

    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});

router.delete('/:cartId/product/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        
        await cartManager.deleteProductFromCart(cartId, productId);
        return res.status(200).send({message: 'Producto Eliminado del carrito'});

    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }
});



export default router;