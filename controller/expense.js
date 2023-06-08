const Expense = require("../model/expense");

const path = require("path");

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
  try {
    const { amount, description, category } = req.body;
    console.log(amount, description, category);

    if (isStringValid(description) || isStringValid(category)) {
      return res.status(400).json({ success: false, message: "bad parameter" });
    }
    console.log("login user id>>", req.user.id);
    const expense = await Expense.create({
      amount,
      description,
      category,
      userId: req.user.id,
    });
    res
      .status(201)
      .json({ success: true, message: "expense added successfully", expense });
  } catch (err) {
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
  try {
    const expenseId = req.params.id;
    await Expense.destroy({ where: { id: expenseId, userId: req.user.id } })
      //in here the result either gives true or false(0 or 1)
      .then((result) => {
        if (result == 0) {
          return res
            .status(404)
            .json({
              success: false,
              message: "expense dosent belong to the user",
            });
        }
        return res
          .status(200)
          .json({ message: "expense deleted succcessfully" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};
