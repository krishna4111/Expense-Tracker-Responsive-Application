const express=require('express');
 
const Expense=require('../controller/expense');
const router=express.Router();

router.get('/add-expense',Expense.showPage);
router.post('/add-expense',Expense.addExpense)

router.get('/show-all', Expense.fetchAll);
router.delete('/delete-expense/:id',Expense.deleteExpense)
module.exports=router;