const express=require('express');
const User=require('../controller/usercontroller');

const router=express.Router();

router.get('/signup',User.showPage);
router.post('/signup',User.signup);

router.get('/login',User.showLogin)
router.post('/login',User.loginCheck)

module.exports=router;