const userModel = require("../models/user.model");

module.exports.getUser = async function getUser(req, res) {
  try {
    let id = req.id;
    let user = await userModel.findById(id);
    if (user) {
      return res.status(200).json({ status: 'green',message:"user retrieved",data:user});
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


module.exports.updateUser = async function updateUser(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id);
    let dataToBeUpdated = req.body;
    if (user) {
      for (let key in dataToBeUpdated) {
        user[key] = dataToBeUpdated[key];
      }
      user.confirmPassword = user.password;
      const updatedData = await user.save();
      return res.status(200).json({
        status: 'green',
        message: 'Data updated successfully',
        data: updatedData,
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


// Delete User Function 
module.exports.deleteUser = async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        status: 'red',
        message: 'User not found',
      });
    }
    return res.status(200).json({
      status: 'green',
      message: 'Data has been deleted',
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'red',
      message: err.message,
    });
  }
};


module.exports.getAllUser = async function getAllUser(req, res) {
  try {
    let users = await userModel.find();
    if (users) {
      return res.status(200).json({
        status: 'green',
        message: 'Users retrieved',
        data: users,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 'red',
      message: err.message,
    });
  }
};


module.exports.updateProfileImage=function updateProfileImage(req,res){
  res.json({
    message:'file uploaded succesfully'
  });
}


