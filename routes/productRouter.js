const express = require("express");
const productRouter = express.Router();
const multer=require('multer');

 
const {createProduct,deleteProduct,getAllProducts,getProductById,updateProduct,getProductByUser} = require('../controllers/productController')
const{signup,login,isAuthorised,protectRoute,forgetpassword,resetpassword,logout}=require('../controllers/authController');



productRouter.use(protectRoute);


const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images')
    },
    filename:function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`)
    }
});

const filter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      cb(new Error("Not an Image! Please upload an image"), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: filter
});



productRouter.route("/")
.get(getAllProducts)

productRouter
.route("/:id")
.patch(updateProduct)
.delete(deleteProduct)
.get(getProductById)


productRouter.route("/user/:id").get(getProductByUser)

productRouter.post('/addProduct', upload.single('image'),createProduct)



module.exports=productRouter
