const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");

const createUser = async (req, res) => {
  const email = req.body.email;
  const mobile = req.body.mobile;
  try {
    const findUserByEmail = await User.findOne({ email: email });
    const findUserByPhone = await User.findOne({ mobile: mobile });

    if (findUserByEmail) {
      return res.json({
        msg: "Email Already Exists.",
        success: false,
        type: "emailExists",
      });
    } else if (findUserByPhone) {
      return res.json({
        msg: "Phone Number Already Exists.",
        success: false,
        type: "phoneExists",
      });
    } else {
      const newUser = await User.create(req.body);
      const token = await generateToken(newUser?.id);
      const updateUser = await User.findByIdAndUpdate(
        newUser.id,
        {
          token: token,
        },
        {
          new: true,
        }
      );
      res.cookie("jwt", token, {
        secure: false,
      });
      res.json({ user: newUser, redirect: "/dashboard" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ msg: "Internal Server Error", success: false });
  }
};

const userLogin = async (req, res) => {
  console.log("calling");
  const { email, password, token } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const token = await generateToken(findUser?.id);
      console.log("USERTOKEN : ", token);
      console.log("findUSer :", findUser);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          token: token,
        },
        {
          new: true,
        }
      );
      console.log("Generated token:", token);

      res.cookie("jwt", token, {
        secure: false,
      });
      res.cookie("email", findUser.email, {
        httpOnly: true,
        secure: true,
      });

      res.json({
        id: findUser?.id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: token,
        redirect: "/dashboard",
      });
    } else {
      res.json({
        msg: "invalid Credentials.",
        success: false,
        type: "invalid",
      });
    }
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ msg: "Internal Server Error", success: false });
  }
};
const userDashboard = async (req, res) => {};
module.exports = { createUser, userLogin, userDashboard };
