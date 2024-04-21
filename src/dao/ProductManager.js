import productModel from './models/productModel.js';

class ProductManager {

    async getProducts(qLimit, qFilter, qPage, qSort) {
        try {
            let page = parseInt(qPage) || 1;
            let limit = parseInt(qLimit) || 5;
            let query = {};
            if (qFilter) {
                if (qFilter.title) query.title = qFilter.title;
                if (qFilter.code) query.code = qFilter.code;
                if (qFilter.category) query.category = qFilter.category;
                if (qFilter.status) query.status = qFilter.status;
                if (qFilter.price) query.price = qFilter.price;
            }
            let sort = {};

            const products = await productModel.paginate(query, { page, limit, lean: true });

            return {
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                totalPages: products.totalPages,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `?page=${products.page - 1}` : null,
                nextLink: products.hasNextPage ? `?page=${products.page + 1}` : null
            };

        } catch (error) {
            console.error(error.message);
            throw new Error('Error interno del servidor');
        }
    };

    async getProductById(id) {
        try {
            const product = await productModel.findOne({ _id: id });
            if (!product) {
                throw new Error(`El producto ${id} no existe`);
            }
            return product;
        } catch (error) {
            console.error('Error al obtener producto por ID', error);
        }
    }
    async getLastProduct() {
        try{
            return await productModel.findOne().sort({ _id: -1 });
        } catch(error){
            console.error('Error al obtener último producto', error);
        }
    }

    async addProduct(product) {
        const { title, description, price, status, thumbnails, code, stock, category } = product;

        try {
            const existingProduct = await productModel.findOne({code: code});

            if (existingProduct) {
                throw new Error('Ya existe un producto con el mismo código');
            }

            if (!title || !description || !code || !price || !stock || !category) {
                throw new Error('Faltan datos para añadir producto');
             }

             if (thumbnails.length == 0){
                throw new Error('Se debe cargar al menos una imagen');
            }
            
            const result = await productModel.create({
                title,
                description,
                price,
                status,
                thumbnails,
                code,
                stock,
                category
            })
            return result;
        } catch (error) {
            console.error(error.message);
            if(error.message){
                throw new Error(error.message);
            }
            else {
                throw new Error('Error interno del servidor');
            }
        }

    }

    async updateProduct(id, update) {
        try {
            const result = await productModel.updateOne({ _id: id }, update)
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al actualizar producto');
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productModel.deleteOne({ _id: id });
            if (result.deletedCount === 0) throw new Error('El producto no existe');
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al eliminar producto');
        }
    }
}

export default ProductManager;