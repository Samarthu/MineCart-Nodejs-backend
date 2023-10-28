const express = require("express");
const orderRouter = express.Router();
 
const {createOrder,getOrderById,getOrders,deleteOrder,updateOrder,getOrderByUser} = require('../controllers/orderController')
const{signup,login,isAuthorised,protectRoute,forgetpassword,resetpassword,logout}=require('../controllers/authController');


orderRouter.use(protectRoute);


// For Getting ALL Products
orderRouter.route('/')
.get(getOrders)

// For Specific ID related Operation
orderRouter.route("/:id")
.patch(updateOrder)
.delete(deleteOrder)
.get(getOrderById)

orderRouter.route('/addOrder')
.post(createOrder)

orderRouter.route("/user/:id").get(getOrderByUser)




module.exports = orderRouter;

