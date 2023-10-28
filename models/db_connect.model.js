const mongoose=require('mongoose')
const db_link = "mongodb+srv://admin:GKcSNQfUSfLfjOxp@cluster0.ixvoeul.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(db_link).then(()=>{
    console.log('db connected')
}).catch((err)=>{
    console.log('Error In DB',err)
})

module.exports=mongoose;