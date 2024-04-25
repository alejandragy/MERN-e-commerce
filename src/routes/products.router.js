import { Router } from 'express';
import { uploader } from '../utils.js';
import ProductManager from '../dao/ProductManager.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        let productsData = await manager.getProducts();

        return res.status(200).send(productsData);
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
});

router.get('/realtime', async (req, res) => {
    try {
        let productsData = await manager.getProductsRealTime();

        return res.status(200).send(productsData);
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' })
    }
});


router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        let product = await manager.getProductById(productId);

        return product ? res.status(200).send(product) : res.status(400).send({ error: 'Producto no encontrado' });
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' })
    }

});

router.post('/', uploader.array('thumbnails', 2), async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category } = req.body;
        const thumbnails = req.files.map(file => file.path);
        const thumbnailsProcessedRoutes = thumbnails.map(path => path.replace('public', ''));

        await manager.addProduct({ title, description, code, price, status, stock, category, thumbnails: thumbnailsProcessedRoutes });
        return res.status(201).send({ message: `Producto -${title}- añadido` });
    } catch (error) {
        //console.log('EL ERROR RETORNADO A VER :o', error.message) //pruebita
        if (error.message != 'Error interno del servidor') {
            console.error(error)
            return res.status(400).send({ error: error.message });
        }
        else {
            console.error(error);
            return res.status(500).send({ error: error.message });
        }
    }
})

router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        await manager.updateProduct(parseInt(productId), req.body);
        return res.status(201).send({ message: 'Producto actualizado' });
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }

});

router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        await manager.deleteProduct(productId);
        return res.status(200).send({ message: 'Producto eliminado' });
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }

});

export default router;