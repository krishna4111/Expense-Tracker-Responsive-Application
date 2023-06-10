const express=require('express');
const router=express.Router();
const forgotpasswordController=require('../controller/forgotpassword')

router.get('/forgotpassword',forgotpasswordController.showPage)
router.post('/forgotpassword',forgotpasswordController.forgotPassword);

module.exports=router;