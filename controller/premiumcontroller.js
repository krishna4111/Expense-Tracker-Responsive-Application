const User=require('../model/user');
const Expense=require('../model/expense');


const getLeaderBoard=async(req,res)=>{
    try{
        const user=await User.findAll();
        const expenses=await Expense.findAll();
        const userAggregatedExpenses={}
        expenses.forEach((expense)=>{
          if(userAggregatedExpenses[expense.userId]){
            userAggregatedExpenses[expense.userId] =  userAggregatedExpenses[expense.userId]+ expense.amount;
          }
          else{
            userAggregatedExpenses[expense.userId]= expense.amount;
          }
        })
        var userLeaderBoardDetails=[];
        user.forEach((user)=>{
            userLeaderBoardDetails.push({name:user.name , total_cost:userAggregatedExpenses[user.id]})
        })
        userLeaderBoardDetails.sort((a,b)=>{
          return  b.total_cost - a.total_cost;
        })
        console.log(userLeaderBoardDetails);
        res.status(200).json(userLeaderBoardDetails);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports={
    getLeaderBoard
}