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
      const check=await  User.findAll({ where :{ email } })
        console.log(check.length);
        if(check.length>=1){
            if(check[0].password === password){
                res.status(201).json({ success:true , message:'user logged in successfully' });
            }
            else{
                return res.status(400).json({ success:false , message:'password is wrong'})
            } 
        }
//if user dosent exist 
        else{
           return  res.status(404).json({success:false , message:'user dosent exitst'})
        }
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err})
    }
    
   
}