import cartModel from './models/cartModel.js';

class CartsManager {

    async getCarts() {
        try {
            return await cartModel.find();
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al obtener los carritos');
        }
    };

    async getCartById(id) {
        try {
            const cart = await cartModel.findById(id).populate('products.product');
            if (!cart) {
                throw new Error('El carrito no existe');
            }
            
            return cart;
        } catch (error) {
            console.error('Error al obtener carrito por ID', error);
        }
    }

    async createCart() {
        try {
            const cart = new cartModel({
                products: [],
            });
            await cart.save();

            return cart;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al crear carrito');
        }

    }


    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            const existingProduct = cart.products.find(p => p.product.toString() == productId);

            if (!cart) {
                throw new Error('El carrito no existe');
            }

            if (existingProduct) {
               existingProduct.quantity+=1;
            }
            else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al agregar producto');
        }
    }

    async updateCart(cartId, products){
        try {
            return await cartModel.findByIdAndUpdate({_id: cartId}, {products: products});
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al actualizar carrito');
        }
    }

    async updateQuantity(cartId, productId, quantity){
        try {
            return await cartModel.findOneAndUpdate({_id: cartId, 'products.product': productId},{$set: { 'products.$.quantity': quantity } });
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al actualizar carrito');
        }
    }

    async deleteAllProductsFromCart(cartId){
        try {
            return await cartModel.findByIdAndUpdate({_id: cartId}, {products: []});
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al vaciar carrito');
        }
    }

    async deleteProductFromCart(cartId, productId){
        try {
            return await cartModel.findOneAndUpdate({_id: cartId}, {$pull: {products: {product:productId}}});
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al eliminar producto del carrito');
        }
    }

}

export default CartsManager;