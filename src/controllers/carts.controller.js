import cartService from '../services/carts.service.js'

class CartController{

    getCarts = async(req,res)=>{
        try{
            let carts = await cartService.getCarts()
            res.send({ status:"success", payload: carts})
        }catch(e){
            res.status(400).send({status:"Error", error: `Failed to load carts. ${e.message}`})
        }
    }

    getCartById = async(req,res)=>{
        try{    
            const id = req.params.cid
            let cart = await cartService.getCartById(id)
            if(cart)
                res.send({ status:"success", payload: cart})
            else
                res.status(400).send({status:"Error", error: `Cart with ID ${id} not found`})
        }catch(e){
            res.status(400).send({status:"Error", error: `Failed to find cart. ${e.message}`})
        }
    }

    createCart = async(req,res)=>{
        try{
            let newCart ={
                products:[]
            }
            const result = await cartService.createCart(newCart)
            res.send({ status:"success", payload: result})
        }catch(e){
            res.status(400).send({status:"Error", error: `Failed to add cart. ${e.message}`})
        }
    }

    addProductToCart = async(req,res)=>{
        try{
            const cartId = req.params.cid
            const productId = req.params.pid
            const result = await cartService.addProductToCart(cartId,productId)
            if(result)
                res.send({ status:"success", payload: result})
            else
                res.status(400).send({status:"Error", error: `Can't add product. Cart with ID ${cartId} not found`})
        }catch(e){
            res.status(400).send({status:"Error", error: `Failed to add product to cart. ${e.message}`})
        }
    }

    updateCart = async(req,res)=>{
        try{
            const cartId = req.params.cid
            const { products } = req.body
            const result = await cartService.updateCart(cartId, products)
            if(result)
                res.send({ status:"success", payload: result})
            else
                res.status(400).send({status:"Error", error: `Can't update. Cart with ID ${cartId} not found`})
        }catch(e){
            res.status(400).send({status:"Error", error: `Failed to update cart. ${e.message}`})
        }
    }

    updateQuantity = async(req,res)=>{
        try{
            const cartId = req.params.cid
            const productId = req.params.pid
            const cantidad = req.body.quantity
            const result = await cartService.updateQuantity(cartId, productId, cantidad)
            if(result)
                res.send({ status:"success", payload: result})
            else
                res.status(400).send({status:"Error", error: `Can't update the cart`})
        }catch(e){
            res.status(400).send({status:"Error", error: `Failed to update product quantity. ${e.message}`})
        }
    }

    deleteProductInCart= async(req,res)=>{
        try{
            const cartId = req.params.cid
            const productId = req.params.pid
            const result = await cartService.deleteProductInCart(cartId,productId)
            if(result)
                res.send({ status:"success", payload: result})
            else
                res.status(400).send({status:"Error", error: `Can't delete. Cart with ID ${cartId} not found`})
        }catch(e){
            res.status(400).send({status:"Error", error: `Failed to delete product in the cart. ${e.message}`})
        }
    }
    
    deleteAllProductsInCart =async(req,res)=>{
        try{
            const id = req.params.cid
            const result = await cartService.deleteAllProductsInCart(id)
            if(result)
                res.send({ status:"success", payload: result})
            else
                res.status(400).send({status:"Error", error: `Can't delete. Cart with ID ${id} not found`})
        }catch(e){
            res.status(400).send({status:"Error", error: `Failed to delete all products of the cart. ${e.message}`})
        }
    }
}
export default new CartController()