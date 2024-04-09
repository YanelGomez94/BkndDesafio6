import { Router } from "express";
import Carts from '../dao/dbManagers/carts.js'
import Messages from '../dao/dbManagers/messages.js'
import productsModel from "../dao/models/products.js";
import mongoose from "mongoose";

const cartsManager = new Carts()
const messagesManager = new Messages()
const router = Router()

router.get('/products', async (req,res) => {
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
        res.render('products',{     
            user: req.session.user,
            products: products.docs, 
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}` : '',
            nextLink: products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}` : ''
        })
})
  
router.get('/carts/:cid', async(req,res) => {
    try{
        const id  = req.params.cid
        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).send('ID de carrito no válido')
        let cart = await cartsManager.getById(id)
        if (!cart || cart.length === 0) 
            return res.status(404).send('Carrito no encontrado')
        if(cart.products.length === 0)
            return res.status(404).send('Carrito vacio')
            const data = {
                products: cart.products.map((product) => ({
                    quantity: product.quantity,
                    title: product._id.title,
                    description: product._id.description,
                    price: product._id.price,
                })),
            }
        res.render('carts', {data})
    }catch(e){
        console.error(e)
    }
})

router.get("/chat", async(req, res) => {
    let messages = await messagesManager.getAll()
	res.render("chat", {messages})
})

router.get("/register", (req, res) => {
    res.render("register");
})
  
router.get("/", (req, res) => {
    res.render("login");
})
  
router.get("/profile", (req, res) => {
    res.render("profile", {
      user: req.session.user,
    })
})

router.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(!err){
            //res.send({status: 'succes', message: 'Sesion cerrada con exito'})
            res.render('login')
        }
        else res.send({status:'error', message: 'Problema al cerrar sesion'})
    })
})



export default router;