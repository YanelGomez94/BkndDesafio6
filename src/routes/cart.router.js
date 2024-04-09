import { Router } from "express";
import Carts from "../dao/dbManagers/carts.js";

const router = Router()
const CartsManager = new Carts()

router.get('/', async (req, res)=>{
    try{
        let carts = await CartsManager.getAll()
        res.send({ status:"success", payload: carts})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to load carts. ${e.message}`})
    }
}) 

router.get('/:cid', async (req, res)=>{
    try{    
        const id = req.params.cid
        let cart = await CartsManager.getById(id)
        if(cart)
            res.send({ status:"success", payload: cart})
        else
            res.status(400).send({status:"Error", error: `Cart with ID ${id} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to find cart. ${e.message}`})
    }
}) 

router.post('/', async(req,res)=>{
    try{
        let newCart ={
            products:[]
        }
        const result = await CartsManager.addCart(newCart)
        res.send({ status:"success", payload: result})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to add cart. ${e.message}`})
    }
})

router.post('/:cid/products/:pid', async(req,res)=>{
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const result = await CartsManager.addProductToCart(cartId,productId)
        if(result)
            res.send({ status:"success", payload: result})
        else
            res.status(400).send({status:"Error", error: `Can't add product. Cart with ID ${cartId} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to add product to cart. ${e.message}`})
    }
})

router.put('/:cid', async(req,res)=>{
    try{
        const cartId = req.params.cid
        const { products } = req.body
        const result = await CartsManager.updateCart(cartId, products)
        if(result)
            res.send({ status:"success", payload: result})
        else
            res.status(400).send({status:"Error", error: `Can't update. Cart with ID ${cartId} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to update cart. ${e.message}`})
    }
})

router.put('/:cid/products/:pid', async(req,res)=>{
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const cantidad = req.body.quantity
        const result = await CartsManager.updateQuantity(cartId, productId, cantidad)
        if(result)
            res.send({ status:"success", payload: result})
        else
            res.status(400).send({status:"Error", error: `Can't update the cart`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to update product quantity. ${e.message}`})
    }
})

router.delete('/:cid/products/:pid', async(req,res)=>{
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const result = await CartsManager.deleteProductInCart(cartId,productId)
        if(result)
            res.send({ status:"success", payload: result})
        else
            res.status(400).send({status:"Error", error: `Can't delete. Cart with ID ${cartId} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to delete product in the cart. ${e.message}`})
    }
})

router.delete('/:cid', async(req,res)=>{
    try{
        const id = req.params.cid
        const result = await CartsManager.deleteAllProductsInCart(id)
        if(result)
            res.send({ status:"success", payload: result})
        else
            res.status(400).send({status:"Error", error: `Can't delete. Cart with ID ${id} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to delete all products of the cart. ${e.message}`})
    }
})

export default router