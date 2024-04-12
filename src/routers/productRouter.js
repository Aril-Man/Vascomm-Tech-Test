import express from 'express'
import { verifyJwt } from '../middleware/authMiddleware.js';
import { getProductById, getProducts, softDelete, storeProduct, updateProduct } from '../controllers/productController.js';

var router = express.Router();

router.get("/products", getProducts)
router.get("/product/:id", verifyJwt, getProductById)
router.post("/product", verifyJwt, storeProduct)
router.put("/product/:id", verifyJwt, updateProduct)
router.delete("/product/:id", verifyJwt, softDelete)

export {
    router
}