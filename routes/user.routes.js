const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// registration
userRouter.post("/register", async (req, res) => {
  const { email, pass, location, age } = req.body;
  try {
    // hashing password
    bcrypt.hash(pass, 5, async (err, hash) => {
      const user = new UserModel({ email, pass: hash, location, age });
      await user.save();
      res.status(200).send({ msg: "Registration has been done!" });
    });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

// login (authentication)
userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    // console.log(user);
    if (user) {
      // comparing password
      bcrypt.compare(pass, user.pass, (err, result) => {
        // pass: which we put into body, user.pass: hash password
        if (result) {
          res.status(200).send({
            msg: "Login Successful!",
            // token: jwt.sign({ name: "papri" }, "saha"),
            token: jwt.sign({ userID: user._id }, "paprikey"),
          }); // payload, signature/secret-key
        } else {
          res.status(400).send({ msg: "Login Failed! Wrong Credentials!" });
        }
      });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

module.exports = { userRouter };
