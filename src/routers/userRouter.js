import express from 'express'
import { getUsers, softDelete, storeUser, updateUser } from '../controllers/userController.js';
import { verifyJwt } from '../middleware/authMiddleware.js';

var router = express.Router();

router.get("/users", getUsers)
router.post("/user", verifyJwt, storeUser)
router.put("/user/:id", verifyJwt, updateUser)
router.delete("/user/:id", verifyJwt, softDelete)

export {
    router
}