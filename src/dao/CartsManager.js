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
            const existingProduct = cart.products.find(p => p.product.toString() == productId._id);

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

    async deleteAllProductsFromCart(cart){
        try {
            return await cartModel.findByIdAndUpdate({_id: cart._id}, {products: []});
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al vaciar carrito');
        }
    }

    async deleteProductFromCart(cart, product){
        try {
            return await cartModel.findOneAndUpdate({_id: cart._id}, {$pull: {products: {product:product._id}}});
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al eliminar producto del carrito');
        }
    }

}

export default CartsManager;