const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utility/nodemailer");
const { JWT_KEY } = require("../secrets");

//sign up user
module.exports.signup = async function signup(req, res) {
    try {
      let dataObj = req.body;
      let user = await userModel.create(dataObj);
      sendMail("signup",user);
      if (user) {
        return res.status(201).json({
          status: 'green',
          message: 'User signed up',
          data: user,
        });
      } else {
        return res.status(400).json({
          status: 'red',
          message: 'Error while signing up',
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 'red',
        message: err.message,
      });
    }
};
  

//login user
module.exports.login = async function login(req, res) {
    try {
      let data = req.body;
      if (data.email) {
        let user = await userModel.findOne({ email: data.email });
        if (user) {
          //bcrypt -> compare
          if (user.password === data.password) {
            let uid = user["_id"]; //uid
            let token = jwt.sign({ payload: uid }, JWT_KEY);
            res.cookie("login", token);
            res.cookie('userInfo',JSON.stringify(user))
            // res.cookie('isLoggedIn',true);
            return res.status(200).json({
              status: 'green',
              message: 'User has logged in',
              data: user, // userDetails:data,
            });
          } else {
            return res.status(401).json({
              status: 'red',
              message: 'Wrong credentials',
            });
          }
        } else {
          return res.status(404).json({
            status: 'red',
            message: 'User not found',
          });
        }
      } else {
        return res.status(400).json({
          status: 'red',
          message: 'Empty field found',
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 'red',
        message: err.message,
      });
    }
  };
  

//isAuthorised-> to check the user's role [admin,user,restaurant,deliveryboy]

module.exports.isAuthorised = function isAuthorised(roles) {
  return function (req, res, next) {
    if (roles.includes(req.role) == true) {
      next();
    } else {
      res.status(401).json({
        status:'red',
        message: "operation not allowed",
      });
    }
  };
};

//protectRoute
module.exports.protectRoute = async function protectRoute(req, res, next) {
    try {
      let token;
      if (req.cookies.login) {
        console.log(req.cookies);
        token = req.cookies.login;
        let payload = jwt.verify(token, JWT_KEY);
        if (payload) {
          console.log("payload token", payload);
          const user = await userModel.findById(payload.payload);
          req.role = user.role;
          req.id = user.id;
          console.log(req.role, req.id);
          next();
        } else {
          return res.status(401).json({
            status: 'red',
            message: 'Please login again',
          });
        }
      } else {
        // Browser
        // const client = req.get('User-Agent');
        // console.log(client)
        // if (client.includes('Mozilla') === true ||  client.includes('Chrome') === true) {
        //   return res.status(302).redirect('/login');
        // }
        // Postman
        return res.status(401).json({
          status: 'red',
          message: 'Please login',
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 'red',
        message: err.message,
      });
    }
  };
  
//forgetPassword

module.exports.forgetpassword = async function forgetpassword(req, res) {
    let { email } = req.body;
    try {
      const user = await userModel.findOne({ email: email });
      if (user) {
        // Create a reset token
        const resetToken = user.createResetToken();
  
        // Create a reset password link
        let resetPasswordLink = `${req.protocol}://${req.get("host")}/resetpassword/${resetToken}`;
  
        let emailData = {
          resetPasswordLink: resetPasswordLink,
          email: email,
        };
        // sendMail("resetpassword", emailData);
  
        return res.status(200).json({
          status: 'green',
          message: 'Reset password link sent',
          data: resetPasswordLink,
        });
      } else {
        return res.status(404).json({
          status: 'red',
          message: 'Please sign up',
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 'red',
        message: err.message,
      });
    }
  };
  

//resetPassword
module.exports.resetpassword = async function resetpassword(req, res) {
    try {
      const token = req.params.token; 
      let { password, confirmPassword } = req.body;
      const user = await userModel.findOne({ resetToken: token });
      if (user) {
        // Reset the user's password
        user.resetPasswordHandler(password, confirmPassword);
        await user.save();
        return res.status(200).json({
          status: 'green',
          message: 'Password changed successfully. Please login again.',
        });
      } else {
        return res.status(404).json({
          status: 'red',
          message: 'User not found',
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 'red',
        message: err.message,
      });
    }
  };
  

module.exports.logout=function logout(req,res){
  res.cookie('login',' ',{maxAge:1});
  res.status(200).json({
    status:'green',
    message:"user logged out succesfully"
  });
}
