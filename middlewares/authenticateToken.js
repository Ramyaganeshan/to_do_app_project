const { tokenValidator } = require("../config/jwtToken");

const authenticateToken = async function (req, res, next) {
  try {
    const { jwt } = req.cookies;
    console.log("TOKEN : ", jwt);
    const valid = await tokenValidator(jwt);
    if (valid) {
      next();
    } else {
      res.locals.errorMessage = "Access Denied! Please login again";
      res.render("login");
    }
  } catch (error) {
    res.send(error);
  }
};

module.exports = authenticateToken;
