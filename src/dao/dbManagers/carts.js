import cartsModel from '../models/carts.js'
import productsModel from '../models/products.js'

export default class Carts{

    constructor(){
        console.log('Trabajando con carritos en mongoDB')
    }

    getAll = async() => {
        let carts = await cartsModel.find().lean()
        return carts;
    }

    getById = async(id) => {
        let cart = await cartsModel.find({_id: id})
        return cart;
    }

    createCart = async () => {
        let result = await cartsModel.create({})
        return result
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
                const existingProductIndex = cart[0].products.findIndex((product) => product._id === productId)
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

    updateCart = async (id, cart) => {
        let result = []
        const exist = await this.getById(id)
        if(exist.length > 0)
            result = await cartsModel.updateOne({_id: id}, cart)
        else
            result = false
        return result
    }

    deleteCart = async (id) => {
        let result = []
        const exist = await this.getById(id)
        if(exist.length > 0)
            result = await cartsModel.deleteOne({_id: id})
        else
            result = false
        return result
    }
}