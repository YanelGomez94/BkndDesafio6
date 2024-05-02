import productsModel from '../model/products.model.js'

class ProductService{
    getProducts = async()=>{
        try{
            let products = await productsModel.find().lean()
            return products
        }catch(e){
            throw new Error(e.message)
        }
    }
    
    getProductById = async(id)=>{
        try{
            let product = await productsModel.findOne({_id: id})
            return product;
        }catch(e){
            throw new Error(e.message)
        }
    }

    createProduct = async(product)=>{
        try{
            let result = await productsModel.create(product)
            return result
        }catch(e){
            throw new Error(e.message)
        }
    }

    updateProduct = async(id, product)=>{
        try{
            let result = []
            const exist = await this.getProductById(id)
            if(exist)
                result = await productsModel.updateOne({_id: id}, product)
            else
                result = false
            return result
        }catch(e){
            throw new Error(e.message)
        }
    }

    deleteProduct = async(id) =>{
        try{
            let result = []
            const exist = await this.getProductById(id)
            if(exist)
                result = await productsModel.deleteOne({_id: id})
            else
                result = false
            return result
        }catch(e){
            throw new Error(e.message)
        }
    }
}
export default new ProductService()