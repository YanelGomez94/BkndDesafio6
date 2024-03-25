import { Router } from "express";
import Products from "../dao/dbManagers/products.js";
import productsModel from "../dao/models/products.js";

const router = Router()
const ProductManager = new Products()

/**
 * http://localhost:8080/products?limit=5
 * http://localhost:8080/products?query=ropa
 * http://localhost:8080/products?query=false
   http://localhost:8080/products?query=ropa&limit=2
   http://localhost:8080/products?query=false&sort=desc
 */
router.get('/', async (req, res)=>{
    try{
        const {limit = 10, page = 1, sort , query} = req.query
        const filter ={}
        if (query) {
            filter.$or = [
                { category: query },
                { status: query === 'true' ? true : false } 
            ]
        }   
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
            lean: true
        }
        const products = await productsModel.paginate(filter,options)
        res.send({ 
            status:"Success", 
            payload: products.docs, 
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}` : '',
            nextLink: products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}` : ''
        })
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to load products. ${e.message}`})
    }
}) 

router.get('/:pid', async (req, res)=>{
    try{
        const id = req.params.pid
        let product = await ProductManager.getById(id)
        if(product.length > 0)
            res.send({ status:"Success", payload: product})
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
        res.send({ status:"Success", payload: result})
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
            res.send({ status:"Success", payload: result})
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
            res.send({ status:"Success", payload: result})
        else
            res.status(400).send({status:"Error", error: `Can't delete. Product with ID ${id} not found`})
    }catch(e){
        res.status(400).send({status:"Error", error: `Failed to delete product. ${e.message}`})
    }
})

export default router