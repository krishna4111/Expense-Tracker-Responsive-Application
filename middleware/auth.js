const jwt = require("jsonwebtoken");

const User = require("../model/user");

exports.authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(req.header);
    console.log('token>>>' , token);
    const user = jwt.verify(token, "secretkey");
    // console.log(user.userId);
    User.findByPk(user.userId).then((user) => {
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false });
  }
};
//module.exports=authentication;
