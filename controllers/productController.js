const Product = require('../models/product.model')
const fs = require('fs')

module.exports.createProduct = async function(req,res){
    try{

        let prod = req.body
        let file = prod.image
        prod.image = req.file.filename
        let product = await Product.create(prod)
        if(product){
            return res.status(200).json({
                message:'Product Created SuccessFully',
                data:product,
                status:"green"
            })
        }else{
            fs.unlink(req.file.path, (err) => {
                if (err) {
                  console.error('Failed to revoke file upload:', err);
                }
                console.error('File upload revoked.');
            });

            res.json({
                message: "error while creating product",
                status:"red"
            })
        }    
    }
   catch(err){
    fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Failed to revoke file upload:', err);
        }
        console.error('File upload revoked.');
    });

    res.status(500).json({
        status:"red",
        message:err.message
    });
}
}

module.exports.deleteProduct = async function(req,res){
    try{
        let id = req.params.id
        let product = await Product.findByIdAndDelete(id)
        if(!product){
            res.json({
                status:"red",
                message:"product not found"
            })
        }else{
            res.json({
                status:"green",
                message:"Product is Deleted SuccessFully..!",
                data:product
            })
        }
    }
    catch(err){
        res.status(500).json({
            status:"red",
            message:err.message
        });
    }
}
module.exports.updateProduct = async function(req,res){
    try{
        let id = req.params.id
        let product = await Product.findById(id)
        console.log('product info',product);
        let dataToBeUpdated = req.body
        if(product){
            let keys = []
            for (let key in dataToBeUpdated) {
                console.log(key);
                keys.push(key);
            }
            for (let i = 0; i < keys.length; i++) {
                console.log(keys[i]);
                product[keys[i]] = dataToBeUpdated[keys[i]];
            }
            const updatedProduct = await product.save()
            console.log(updatedProduct)
            res.json({
                status:"green",
                message: "Product Data updated successfully",
                data: updatedProduct,
            })
        }
        else{
            res.json({
                status:"red",
                message:'Product Not Found'
            })
        }
    }
    catch(err){
        res.status(500).json({
            status:"red",
            message:err.message
        });
    }
}


module.exports.getAllProducts = async function (req, res) {
    try {
      // Ensure the MongoDB connection is established before querying
      const products = await Product.find();
  
      if (products.length > 0) {
        return res.status(200).json({
          status: 'green',
          message: 'Products retrieved',
          data: products,
        });
      } else {
        return res.status(404).json({
          status: 'red',
          message: 'No products found',
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 'red',
        message: err.message,
      });
    }
  };
  

module.exports.getProductById = async function(req,res){
    try{
        let id = req.params.id
        let product=await Product.findById(id);
        if(!product){
            return res.status(404).json({status:'red',message: 'Product not found' });
        }
        res.status(200).json({
            message:'products retrieved',
            data:product,
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

module.exports.getProductByUser = async function(req,res){
    try{
        let id = req.params.id
        let products=await Product.find({createdBy:id});
        if (!products || products.length === 0) {
            return res.status(404).json({
              status: 'red',
              message: 'No products found for this user',
            });
          }
        res.status(200).json({
            message:'products retrieved',
            data:products,
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