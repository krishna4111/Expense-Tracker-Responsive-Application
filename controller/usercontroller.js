const User=require('../model/user');
const path=require('path');
const bcrypt=require('bcrypt');

exports.showPage=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','view','form.html'))
}

exports.showLogin=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','view','login.html'))
}
 function isStringValid(string){
    if(string==undefined || string.length==0){
        return true;
    }
    else{
        return false;
    }
 }
exports.signup=async (req,res,next)=>{
    try{
        //using destructor here
        const {name , email , password} = req.body;

        if(isStringValid(name) || isStringValid(email) || isStringValid(password) ){
            //status 400 means bad parameter
            return res.status(400).json({err:"bad parameter, some parameter is missing"})
        }
        const saltrounds=10;
        bcrypt.hash(password,saltrounds,async (err,hash)=>{
            await User.create({ name,email,password:hash  })
            res.status(201).json({ message:'successfully created new user' })
        })
        
    }
   catch(err){
    res.status(500).json({
        error:err
    })
   }
    
}

exports.loginCheck=async (req,res,next)=>{
    try{
        const{email,password}=req.body;
      const check=await  User.findAll({ where :{ email } })
        if(check.length>=1){
            bcrypt.compare(password,check[0].password,(err,result)=>{
               if(err){
             //   res.status(500).json({success:false , message:'something went wrong'})
                //instead sending error we can through error
                throw new Error('something went wrong');
                //the above line directly takes our code to catch block
               }
                if(result===true){
                    res.status(201).json({ success:true , message:'user logged in successfully' });
                }
                else{
                    
                    return res.status(400).json({ success:false , message:'password is wrong'})
                } 
            })
            
        }
//if user dosent exist 
        else{
           return  res.status(404).json({success:false , message:'user dosent exitst'})
        }
        
    }
    catch(err){
        res.status(500).json({message:err , success:false});
    }
    
   
}