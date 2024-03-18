import { Router } from "express";
import Products from "../dao/dbManagers/products.js";

const router = Router()
const ProductManager = new Products()

router.get('/', async (req, res)=>{
    try{
        let products = await ProductManager.getAll()
        res.send({ status:"success", payload: products})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to load products. ${e.message}`})
    }
}) 

router.get('/:pid', async (req, res)=>{
    try{
        const id = req.params.pid
        let product = await ProductManager.getById(id)
        if(product.length > 0)
            res.send({ status:"success", payload: product})
        else
            res.status(400).send({status:"Error", error: `Product with ID ${id} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to find product. ${e.message}`})
    }
}) 

router.post('/', async(req,res)=>{
    try{
        const { title, description, code, price, stock, category, thumbnails } = req.body
        if (!title || !description || !code || !price || !stock || !category)
			return res.status(200).send({status:"Error", error: "All fields are required to add a product"});
        let newProduct ={
            title,description,code,price,stock,category,thumbnails
        }
        const result = await ProductManager.addProduct(newProduct)
        res.send({ status:"success", payload: result})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to add product. ${e.message}`})
    }
})

router.put('/:pid', async(req,res)=>{
    try{
        const id = req.params.pid
        const { title, description, code, price, stock, category, thumbnails } = req.body
        if (!title || !description || !code || !price || !stock || !category)
			return res.status(200).send({status:"Error", error: "All fields are required to update a product"});
        let newProduct ={
            title,description,code,price,stock,category,thumbnails
        }
        const result = await ProductManager.updateProduct(id, newProduct)
        if(result)
            res.send({ status:"success", payload: result})
        else
            res.status(400).send({status:"Error", error: `Can't update. Product with ID ${id} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to update products. ${e.message}`})
    }
})

router.delete('/:pid', async(req,res)=>{
    try{
        const id = req.params.pid
        const result = await ProductManager.deleteProduct(id)
        if(result)
            res.send({ status:"success", payload: result})
        else
            res.status(400).send({status:"Error", error: `Can't delete. Product with ID ${id} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to delete product. ${e.message}`})
    }
})

export default router