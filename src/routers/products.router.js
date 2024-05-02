import { Router } from "express"
import productsController from "../controllers/products.controller.js";
 
/*class ProductRouter{
    constructor(){
        this.InicioProducto= Router();
        this.InicioProducto.get('/',productsController.getProducts)
    }
    getRouter(){
        return this.InicioProducto
    }
}
export default new ProductRouter()*/


const productRouter = Router()

productRouter.get('/', productsController.getProducts)
productRouter.get('/:pid', productsController.getProductById)
productRouter.post('/', productsController.createProduct)
productRouter.put('/:pid', productsController.updateProduct)
productRouter.delete('/:pid', productsController.deleteProduct)

export default productRouter;