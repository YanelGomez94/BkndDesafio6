import cartsModel from '../models/carts.js'
import productsModel from '../models/products.js'

export default class Carts{

    constructor(){
        //console.log('Trabajando con carritos en mongoDB')
    }

    getAll = async() => {
        const carts = await cartsModel.find({}).populate({
            path: "products",
            populate: { path: "_id", model: "products" },
          }).lean()
        return carts;
    }

    getById = async(id) => {
        let cart = await cartsModel.find({_id: id}).populate({
            path: "products",
            populate: { path: "_id", model: "products" },
        }).lean()
        return cart;
    }

    addCart = async (cart) => {
        let result = await cartsModel.create(cart)
        return result
    }

    addProductToCart = async (cartId,productId) => {
        let result = []
        const cart = await this.getById(cartId)
        if(cart.length > 0){
            const validProduct = await productsModel.find({_id: productId })
            if(validProduct.length > 0){
                const existingProductIndex = cart[0].products.findIndex((product) => product._id.valueOf() === productId)
                if (existingProductIndex !== -1) 
                    cart[0].products[existingProductIndex].quantity += 1
                else {
                    const newProduct = { _id: productId, quantity: 1 }
                    cart[0].products.push(newProduct)
                }
                result = await cartsModel.updateOne({ _id: cartId }, { $set: { products: cart[0].products } })
            }else
                result = false
        }
        else
            result = false
        return result
    }

    updateCart = async (cartId, products) => {
        let result = []
        const exist = await this.getById(cartId)
        if(exist.length > 0){
            result = await cartsModel.findByIdAndUpdate( cartId, {
                products: products,
            })
        }else
            result = false
        return result
    }

    updateQuantity = async (cartId, productId, cantidad) => {
        let result = []
        const cart = await this.getById(cartId)
        if(cart.length > 0){
            console.log(cart[0].products)
            const productIndex = cart[0].products.findIndex(product => product._id.valueOf() === productId)
            if (productIndex === -1) 
                return result = false
            cart[0].products[productIndex].quantity = cantidad
            result = await cartsModel.updateOne({ _id: cartId}, { $set: cart[0] })
        }else
            result = false
        return result
    }

    deleteProductInCart = async (cartId, productId)=>{
        let result = []
        const cart = await this.getById(cartId)
        if(cart.length > 0){
            const productIndex = cart[0].products.findIndex(product => product._id.valueOf() === productId)
            if (productIndex === -1) 
                return result = false
            cart[0].products.splice(productIndex, 1)
            result = await cartsModel.updateOne({ _id: cartId}, { $set: cart[0] });
        }else
            result = false
        return result
    }

    deleteAllProductsInCart = async (id) => {
        let result = []
        const cart = await this.getById(id)
        if(cart.length > 0){
            result = await cartsModel.updateOne({ _id: id }, { $set: { products: [] } })
        }            
        else
            result = false
        return result
    }
}