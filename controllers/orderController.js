const Order = require("../models/order.model")
// Controller function to create a new order
module.exports.createOrder = async function (req, res)  {
    try {
      const { user, products, totalAmount } = req.body;
      const order = new Order({ user, products, totalAmount });
      const savedOrder = await order.save();
      res.status(200).json({
        status:"green",
        data:savedOrder,
        message:"Order Is Placed"
    });
    } catch (error) {
      res.status(500).json({ status:"red", message: 'Error creating the order' + JSON.stringify(error.message)});
    }
};
  

  // Controller function to get a list of all orders
module.exports.getOrders = async function (req, res){
    try {
      const orders = await Order.find().populate('user').populate('products.product');
      res.status(200).json({status:"green",data:orders,  message:"Order Retrived"});
    } catch (error) {
        res.status(500).json({ status:"red", message: 'Error Fetching the order' + JSON.stringify(error.message)});
    }
};


  // Controller function to get a specific order by its ID
module.exports.getOrderById = async function (req, res){
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId).populate('user').populate('products.product');
      if (!order) {
        return res.status(404).json({status:'red',message: 'Order not found' });
      }
      res.status(200).json({status:'green',message:`Order :${orderId} is found and retrieved`,data:order });
    } catch (error) {
      res.status(500).json({ status:'red',message: 'Error fetching order'+ JSON.stringify(error.message) });
    }
};


module.exports.updateOrder = async function (req, res) {
    try {
      const orderId = req.params.id;
      const { user, products, totalAmount } = req.body;
      const updatedOrder = await Order.findByIdAndUpdate(orderId, { user, products, totalAmount }, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ status: 'red', message: 'Order not found' });
      }
      res.status(200).json({ status: 'green', message: `Order ${orderId} is updated successfully`,data:updatedOrder });
    } catch (error) {
      res.status(500).json({ status: 'red', message: 'Error updating the order' + JSON.stringify(error.message)});
    }
};

module.exports.deleteOrder = async function (req, res) {
    try {
      const orderId = req.params.id;
      const deletedOrder = await Order.findByIdAndRemove(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ status: 'red', message: 'Order not found' });
      }
      res.status(200).json({
        status:'green',
        message :'Order Delete Successfully'
      }); 
    } catch (error) {
      res.status(500).json({ status: 'red', message: 'Error deleting the order'+ JSON.stringify(error.message) });
    }
};
  

module.exports.getOrderByUser = async function(req,res){
  try{
      let id = req.params.id
      console.log(id)
      let orders=await Order.find({user:id}).populate('user').populate('products.product');
      if (!orders || orders.length === 0) {
          return res.status(404).json({
            status: 'red',
            message: 'No Orders found for this user',
          });
        }
      res.status(200).json({
          message:'Orders retrieved',
          data:orders,
          status:'green'
      });
    }
    catch(err){
      res.status(500).json({
          status:"red",
          message:err.message
      });
  }
}
  
  