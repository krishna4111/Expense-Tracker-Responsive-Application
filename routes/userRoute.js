const express=require('express');
const User=require('../controller/usercontroller');

const router=express.Router();

router.get('/user/signup',User.showPage);
router.post('/user/signup',User.addUser);

module.exports=router;