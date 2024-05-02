import { Router } from "express"
import cartsController from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.get('/', cartsController.getCarts)
cartRouter.get('/:cid', cartsController.getCartById)
cartRouter.post('/', cartsController.createCart)
cartRouter.put('/:cid', cartsController.updateCart)
cartRouter.post('/:cid/products/:pid', cartsController.addProductToCart)
cartRouter.put('/:cid/products/:pid',cartsController.updateQuantity)
cartRouter.delete('/:cid/products/:pid',cartsController.deleteProductInCart)
cartRouter.delete('/:cid',cartsController.deleteAllProductsInCart)

export default cartRouter;