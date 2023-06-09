const Expense = require("../model/expense");

const path = require("path");

const User=require('../model/user');

const sequelize=require('../util/database')

exports.showPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "view", "expense.html"));
};

function isStringValid(string) {
  if (string == undefined || string.length == 0) {
    return true;
  } else {
    return false;
  }
}

exports.addExpense = async (req, res) => {
  const t=await sequelize.transaction();
  try {
    
    const { amount, description, category } = req.body;
   // console.log(amount, description, category);

    if (isStringValid(description) || isStringValid(category)) {
      return res.status(400).json({ success: false, message: "bad parameter" });
    }
    const expense = await Expense.create({
      amount,
      description,
      category,
      userId: req.user.id,
    } , {transaction:t});
    const oldamount=req.user.totalexpense;
    const newamount=Number(oldamount)  + Number(amount) ;
   await User.update({totalexpense:newamount} , {where:{id:req.user.id} , transaction:t });
    await t.commit();
    res.status(201).json({ success: true, message: "expense added successfully", expense });
  } catch (err) {
    await t.rollback()
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.fetchAll = async (req, res) => {
  try {
    const ans = await Expense.findAll({ where: { userId: req.user.id } })
        return res.status(201).json({ success: true, ans });
  }
   catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};

exports.deleteExpense = async (req, res) => {
  const t=await sequelize.transaction();
  try {
    
    const expenseId = req.params.id;

    const expense=await Expense.findByPk(expenseId);
    const reduce=Number(req.user.totalexpense) - Number(expense.amount);
  

    const remove=await Expense.destroy({ where: { id: expenseId, userId: req.user.id } }, {transaction:t});

    await User.update( {totalexpense:reduce} ,  { where : { id:req.user.id } } ,{transaction:t})
   
    
      //in here the result either gives true or false(0 or 1)
      
        if (remove == 0) {
          await t.rollback();
          return res.status(404).json({ success: false , message: "expense dosent belong to the user"  })
        }
        await t.commit();
        return res.status(200).json({ message: "expense deleted succcessfully" });
     
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};
