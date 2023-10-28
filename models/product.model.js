const mongoose = require('./db_connect.model')

// Defining the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  image:String,
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    required:true
  },
});

// Create a Product model based on the schema
const Product = mongoose.model('Product', productSchema);

// Export the Product model for use in your application
module.exports = Product;
