const mongo=require("mongoose");

const donors=mongo.Schema({
    name:{
        type:String,
        require:true
    },
    number:{
        type:Number,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
})

module.exports=mongo.model("donors",donors)