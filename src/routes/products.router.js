import { Router } from 'express';
import { uploader } from '../utils.js';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('src/data/products.json')

router.get('/', async (req, res) => {
    try {
        let products = await manager.getProducts();
        const { limit } = req.query;

        if (limit) {
            products = products.slice(0, limit);
        }

        return res.status(200).send(products);
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

router.post('/',uploader.array('thumbnails', 2), async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category} = req.body;
        const existingProducts = await manager.getProducts();
        const thumbnails = req.files.map(file => file.path);
        const thumbnailsProcessedRoutes = thumbnails.map(path => path.replace('public', ''));

        if (thumbnails.length == 0){
            return res.status(400).send({error: 'Se debe cargar al menos una imagen'});
        }
        if (existingProducts.find(product => product.code === code)) {
            return res.status(400).send({ error: 'Ya existe un producto con el code especificado' });
        }
        if (!title || !description || !code || !price || !stock || !category) {
           return res.status(400).send({ error: 'Faltan datos para añadir producto' });
        }

        await manager.addProduct({ title, description, code, price, status, stock, category, thumbnails: thumbnailsProcessedRoutes });
        return res.status(201).send({ message: `Producto -${title}- añadido`});
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor'});
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

        await manager.deleteProduct(parseInt(productId));
        return res.status(200).send({ message: 'Producto eliminado' });
    } catch (error) {
        return res.status(500).send({ error: 'Error interno del servidor' });
    }

});

export default router;