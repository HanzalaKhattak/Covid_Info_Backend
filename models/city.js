const mongo=require("mongoose");

const city=mongo.Schema({
    name:{
        type:String,
        require:true
    },
    bgimg:{
        type:String,
        require:true
    },
    lockdown:{
        type:String,
    }
})

module.exports=mongo.model("city",city);