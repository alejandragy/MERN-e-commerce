import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async generateId () {
        const products = await this.getProducts();

        if (products.length > 0) {
            return parseInt(products[products.length - 1].id + 1);
        } else {
            return 1;
        }
    }

    async addProduct({title, description, price, status, thumbnail, code, stock, category}) {
        try {
            this.products = await this.getProducts(); //reviso la lista actualizada de productos.

                const product = {
                    id: await this.generateId(),
                    title,
                    description,
                    price,
                    status: status ?? true,
                    thumbnail,
                    code,
                    stock,
                    category
                }

                this.products.push(product);

                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
                console.log('El producto ha sido agregado!');

                return product;
        } catch (error) {
            console.error('Error al agregar producto', error);
        }

    }

    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    async getProductById(id) {
        try {
            this.products = await this.getProducts();
            const productFound = this.products.find(product => product.id === parseInt(id));
            return productFound ? productFound : console.error('No se encontró ningún producto con el ID especificado', error);
        } catch (error) {
            console.error('Error al obtener producto por ID', error);
        }
    }

    async updateProduct(id, update) {
        try {
            this.products = await this.getProducts();
            const product = await this.getProductById(id);

            if (product) {
                //actualización de producto
                const updateProduct = {
                    ...product,
                    ...update,
                    id //id no se modifica
                }

                //actualización de la lista de productos
                const updateProducts = this.products.map(product => (product.id === id) ? updateProduct : product);

                await fs.promises.writeFile(this.path, JSON.stringify(updateProducts, null, '\t'));
                console.log('Producto actualizado!');

                return updateProduct;
            }
            else {
                console.error('No se encontró ningún producto con el ID especificado', error);
            }
        } catch (error) {
            console.error('Error al actualizar producto', error);
        }
    }

    async deleteProduct(id) {
        try {
            const product = await this.getProductById(id);

            if (product) {
                this.products = await this.getProducts();

                const products = this.products.filter(product => product.id != id);

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                console.log('Se elimino el producto!');
            }
            else {
                console.error('No se encontró producto con el ID especificado');
            }

        } catch (error) {
            console.error('Error al eliminar producto', error);
        }
    }
}

export default ProductManager;