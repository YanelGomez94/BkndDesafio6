import cartsModel from '../model/carts.model.js'
import productsModel from '../model/products.model.js'

class CartService{
    getCarts = async()=>{
        try{
            const carts = await cartsModel.find({}).populate({
                path: "products",
                populate: { path: "_id", model: "products" },
            }).lean()
            return carts;
        }catch(e){
            throw new Error(e.message)
        }
    }

    getCartById = async(id)=>{
        try{
            let cart = await cartsModel.findOne({_id: id}).populate({
                path: "products",
                populate: { path: "_id", model: "products" },
            }).lean()
            return cart;
        }catch(e){
            throw new Error(e.message)
        }
    }

    createCart = async(cart)=>{
        try{
            let result = await cartsModel.create(cart)
            return result
        }catch(e){
            throw new Error(e.message)
        }
    }
    
    addProductToCart = async(cartId,productId)=>{
        try{
            let result = []
            const cart = await this.getCartById(cartId)
            if(cart){
                const validProduct = await productsModel.find({_id: productId })
                if(validProduct.length > 0){
                    const existingProductIndex = cart.products.findIndex((product) => product._id._id.valueOf() === productId)
                    if (existingProductIndex !== -1) 
                        cart.products[existingProductIndex].quantity += 1
                    else {
                        const newProduct = { _id: productId, quantity: 1 }
                        cart.products.push(newProduct)
                    }
                    result = await cartsModel.updateOne({ _id: cartId }, { $set: { products: cart.products } })
                }else
                    result = false
            }
            else
                result = false
            return result
        }catch(e){
            throw new Error(e.message)
        }
    }

    updateCart = async(cartId, products)=>{
        try{
            let result = []
            const exist = await this.getCartById(cartId)
            if(exist){
                result = await cartsModel.findByIdAndUpdate( cartId, {
                    products: products,
                })
            }else
                result = false
            return result
        }catch(e){
            throw new Error(e.message)
        }
    }

    updateQuantity = async(cartId, productId, cantidad)=>{
        try{
            let result = []
            const cart = await this.getCartById(cartId)
            if(cart){
                const productIndex = cart.products.findIndex(product => product._id._id.valueOf() === productId)
                if (productIndex === -1) 
                    return result = false
                cart.products[productIndex].quantity = cantidad
                result = await cartsModel.updateOne({ _id: cartId}, { $set: cart })
            }else
                result = false
            return result
        }catch(e){
            throw new Error(e.message)
        }
    }

    deleteProductInCart = async (cartId, productId)=>{
        try{
            let result = []
            const cart = await this.getCartById(cartId)
            if(cart){
                const productIndex = cart.products.findIndex(product => product._id._id.valueOf() === productId)
                if (productIndex === -1) 
                    return result = false
                cart.products.splice(productIndex, 1)
                result = await cartsModel.updateOne({ _id: cartId}, { $set: cart });
            }else
                result = false
            return result
        }catch(e){
            throw new Error(e.message)
        }
    }

    deleteAllProductsInCart = async (id) => {
        try{
            let result = []
            const cart = await this.getCartById(id)
            if(cart){
                result = await cartsModel.updateOne({ _id: id }, { $set: { products: [] } })
            }            
            else
                result = false
            return result
        }catch(e){
            throw new Error(e.message)
        }
    }
}
export default new CartService()