const express=require('express');
const cors=require('cors');
const sequelize=require('./util/database');
const router=require('./routes/userRoute');
const path=require('path');
const expense=require('./routes/expenseRoute');
const User=require('./model/user');
const Expense=require('./model/expense');

const app=express();

app.use(express.json());

app.use(cors());

app.use('/user',router);

app.use('/expense',expense);

app.use(express.static(path.join(__dirname,'public')))

User.hasMany(Expense);

Expense.belongsTo(User);

sequelize
//.sync({force:true})
.sync()
.then(result=>{
    app.listen(4000)
})
.catch(err=>{
console.log(err);
})
