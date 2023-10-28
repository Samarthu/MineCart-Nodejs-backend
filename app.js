const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')


// express instance for server
const app = express()

// Global MiddleWares
app.use(cors())
app.use(express.json())

app.use('/images', express.static('public/images'));
app.use(express.static("dist"))



const port = process.env.PORT || 3000
app.use(cookieParser())


//Starting the Server
app.listen(port,()=>{
    console.log('Server Started on port : ' + port)
})


// Defining Routers
const userRouter = require("./routes/userRouter")
const orderRouter = require("./routes/orderRouter")
const productRouter = require("./routes/productRouter")


// Configuring  Routers
app.use("/api/user",userRouter)
app.use('/api/order',orderRouter)
app.use('/api/product',productRouter)