import express from 'express';
import { authController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/auth/signup', (req,res) => {
    res.status(200).render('register', { 
        title: "Signup to LabKita!",
        pageCSS: "/public/css/register.css"
    })
})

router.post('/auth/signup', authController.signup);

router.get('/auth/login', (req,res) => {
    res.status(200).render('login', { 
        title: "Login to LabKita!",
        pageCSS: "/public/css/login.css"
    })
})

router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

export default router;
