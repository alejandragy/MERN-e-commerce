import fs from 'fs';

class CartsManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    async generateId() {
        const carts = await this.getCarts();

        if (carts.length > 0) {
            return parseInt(carts[carts.length - 1].id + 1);
        } else {
            return 1;
        }
    }

    async createCart() {
        try {
            this.carts = await this.getCarts();

            const cart = {
                id: await this.generateId(),
                products: [],
            }

            this.carts.push(cart);

            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'));
            console.log('El carrito ha sido creado!');

            return cart;
        } catch (error) {
            console.error('Error al crear carrito', error);
        }

    }

    async getCarts() {
        try {
            const carts = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(carts);
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    async getCartById(id) {
        try {
            this.carts = await this.getCarts();
            const cartFound = this.carts.find(cart => cart.id === parseInt(id));
            return cartFound ? cartFound : console.error('No se encontró ningún carrito con el ID especificado', error);
        } catch (error) {
            console.error('Error al obtener carrito por ID', error);
        }
    }

    async getProductsInCart(cart) {
        try {
            return cart ? cart.products : [];
        } catch (error) {
            console.error('Error al obtener los productos del carrito', error);
        }
    }

    async addProductToCart(cart, product, quantity) {
        try {
            const carts = await this.getCarts();
            
            const existingCart = carts.find(c => c.id === cart.id);

            if (existingCart) {
                const existingProduct = existingCart.products.find(p => p.id === product.id);

                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } 
                else {
                    existingCart.products.push({
                        id: product.id,
                        quantity: quantity
                    })
                }
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                return console.log('Carrito actualizado');
            } else {
                return console.error('No se encontró el carrito');
            }
        } catch (error) {
            console.error('Error al agregar producto', error);
        }

    }

}

export default CartsManager;