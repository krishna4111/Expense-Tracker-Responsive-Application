const User=require('../model/user');
const path=require('path');


exports.showPage=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','view','form.html'))
}

exports.addUser=async (req,res,next)=>{
    try{
        const input=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
        res.status(201).json({ insert:input })
    }
   catch(err){
    console.log(err);
    res.status(500).json({
        error:err
    })
   }
    
}