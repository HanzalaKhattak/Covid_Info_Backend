const mongo=require("mongoose")

mongo.Promise=global.Promise;
require("dotenv").config();  
mongo.connect(process.env.MONGO_URI,{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true }).then(()=>{console.log("DataBase is Connected")}).catch((error)=>{
    console.log("Database is not connected",error)
})  