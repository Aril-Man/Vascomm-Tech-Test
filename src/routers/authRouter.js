import express from 'express'
import { callbackGoogle } from '../controllers/authController.js';

var router = express.Router();

router.get('/auth/google/callback', callbackGoogle)

export {
    router
}