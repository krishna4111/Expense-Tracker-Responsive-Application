const express = require("express");
const cors = require("cors");
const sequelize = require("./util/database");
const userRoute = require("./routes/userRoute");
const path = require("path");
const expenseRoute = require("./routes/expenseRoute");
const User = require("./model/user");
const Expense = require("./model/expense");
const purchaseRoute = require("./routes/purchase");
const dotenv = require("dotenv");
const app = express();
const Order = require("./model/order");
const premiumRouter=require('./routes/premium');
const ForgotPasswordRouter=require('./routes/forgotpassword');

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const bodyPaer = require("body-parser");

app.use(bodyPaer.json());

app.use(cors());
dotenv.config();

app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/premium", purchaseRoute);
app.use('/premium',premiumRouter)
app.use('/password',ForgotPasswordRouter)

app.use(express.static(path.join(__dirname, "public")));

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
  //.sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
