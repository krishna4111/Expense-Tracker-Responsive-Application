const express=require('express');
const cors=require('cors');
const sequelize=require('./util/database');
const router=require('./routes/userRoute');
const path=require('path');

const app=express();

app.use(express.json());

app.use(cors());

app.use(router);

app.use(express.static(path.join(__dirname,'public')))


sequelize
.sync()
.then(result=>{
    app.listen(4000)
})
.catch(err=>{
console.log(err);
})
