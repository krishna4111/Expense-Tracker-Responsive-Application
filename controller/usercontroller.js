const User=require('../model/user');
const path=require('path');


exports.showPage=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','view','form.html'))
}

exports.showLogin=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','view','login.html'))
}

exports.addUser=async (req,res,next)=>{
    try{
        //using destructor here
        const {name , email , password} = req.body;

        if(name==null || name.length==0 || email==null || email.length==0 || password==null || password.length==0 ){
            //status 400 means bad parameter
            return res.status(400).json({err:"bad parameter, some parameter is missing"})
        }
        const input=await User.create({
            name,email,password
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

exports.loginCheck=async (req,res,next)=>{
    try{
        const{email,password}=req.body;
      const check=await  User.findAll({
            where:{
                email:email,
                password:password
            }
        })
        console.log(check.length);
        if(check.length>=1){
            res.status(201).json({ result:check });
        }
        else{
            res.status(500).json({error:"you filled a wrong detail"})
        }
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err})
    }
    
   
}