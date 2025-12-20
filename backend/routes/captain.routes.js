import express, { Router } from "express";
import { registerCaptain } from "../controllers/captain.controller.js";
import { loginCaptain } from "../controllers/captain.controller.js";
import { getCaptainProfile } from "../controllers/captain.controller.js";
import { logoutCaptain } from "../controllers/captain.controller.js";
const router = express.Router();
import { body } from "express-validator";
import { authCaptain } from "../middlewares/auth.middleare.js";

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email'),
    body('fullname').isLength({ min: 3 }).withMessage('fullname must be at least 3 character long'),
    body('password').isLength({ min: 6 }).withMessage('password must be at 6 character long'),
    body('mobile').isLength({ min: 10 }).withMessage('mobile must be at 10 character long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('color must be at least 3 character long'),
    body('vehicle.numberplate').isLength({ min: 3 }).withMessage('numberplate must be at least 3 character long'),
    body('vehicle.vehicletype').isLength({ min: 3 }).withMessage('vehicletype must be at least 3 character long'),
    body('vehicle.year').isLength({ min: 4 }).withMessage('year must be at least 4 character long'),
    body('vehicle.capacity').isLength({ min: 1 }).withMessage('capacity must be at least 1 character long'),
],
    registerCaptain
);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('password must be at 6 character long'),
],
    loginCaptain
);

router.get('/profile', authCaptain, getCaptainProfile);

router.get('/logout', authCaptain, logoutCaptain);

export default router;