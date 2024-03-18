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
        if(cart.length > 0)
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

router.post('/:cid/product/:pid', async(req,res)=>{
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const result = await CartsManager.addProductToCart(cartId,productId)
        if(result)
            res.send({ status:"success", payload: result})
        else
            res.status(400).send({status:"Error", error: `Can't add product. Cart with ID ${id} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to add product to cart. ${e.message}`})
    }
})

router.delete('/:cid', async(req,res)=>{
    try{
        const id = req.params.cid
        const result = await CartsManager.deleteCart(id)
        if(result)
            res.send({ status:"success", payload: result})
        else
            res.status(400).send({status:"Error", error: `Can't delete. Cart with ID ${id} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to delete cart. ${e.message}`})
    }
})

export default router