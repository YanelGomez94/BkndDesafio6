import productsModel from '../models/products.js'

export default class Products{

    constructor(){
        console.log('Trabajando con productos en mongoDB')
    }

    getAll = async() => {
        let products = await productsModel.find().lean()
        return products;
    }

    getById = async(id) => {
        let product = await productsModel.find({_id: id})
        return product;
    }

    addProduct = async (product) => {
        let result = await productsModel.create(product)
        return result
    }

    updateProduct = async (id, product) => {
        let result = []
        const exist = await this.getById(id)
        if(exist.length > 0)
            result = await productsModel.updateOne({_id: id}, product)
        else
            result = false
        return result
    }

    deleteProduct = async (id) => {
        let result = []
        const exist = await this.getById(id)
        if(exist.length > 0)
            result = await productsModel.deleteOne({_id: id})
        else
            result = false
        return result
    }
}