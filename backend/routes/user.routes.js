import express, { Router } from "express";
const router = express.Router();
import { body } from "express-validator";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleare.js";
import { getuserProfile } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
router.post('/register', [
  body('email').isEmail().withMessage('Invalid email'),
  body('fullname').isLength({ min: 3 }).withMessage('fullname must be at least 3 character long'),
  body('password').isLength({ min: 6 }).withMessage('password must be at 6 character long'),
],
  registerUser
)

router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('password must be at 6 character long'),
],
  loginUser
)

router.get('/profile', authMiddleware, getuserProfile)

router.get('/logout', authMiddleware, logoutUser);

export default router;


