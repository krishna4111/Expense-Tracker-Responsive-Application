const Sequelize=require('sequelize');

const sequelize=new Sequelize('expense', 'root','root',{
    dialect:'mysql',
    host:process.env.DB_HOST,
})

module.exports=sequelize;