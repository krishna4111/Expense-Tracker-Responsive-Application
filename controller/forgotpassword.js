const nodemailer=require('nodemailer');
const path=require('path');

const showPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "view", "forgetpasswordform.html"));
  };

const forgotPassword=async(req,res)=>{
    try{
        const email=req.body.email;
        console.log(email);
        const mailTransport = nodemailer.createTransport({
            service:"hotmail",
            auth:{
                user:"dummy-001-001@outlook.com",
                pass:"7868889584@Kk1234@Kk"
            }
        })
        const detail={
            from:"dummy-001-001@outlook.com",
            to:email,
            subject:"testing our nodemailer",
            text:"testing our first send"
        }
        
        mailTransport.sendMail(detail ,(err)=>{
            if(err){
                console.log(err)
                res.status(404).json({message:"the email is not valid" , error:err});
            }
            else{
                console.log("email sended");
                res.status(201).json({message:"email sended successfully"})
            }
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong",error:err});
    }
    
}
module.exports={
    forgotPassword,
    showPage
}