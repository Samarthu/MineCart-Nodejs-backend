const mongoose = require('./db_connect.model')

// Define the Order schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

// Create an Order model based on the schema
const Order = mongoose.model('Order', orderSchema);

// Export the Order model for use in your application
module.exports = Order;
