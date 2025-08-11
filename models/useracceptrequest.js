const mongo=require("mongoose");

const useracceptrequest=mongo.Schema({
    name:{
        type:String,
        require:true
    },
    useremail:{
        type:String,
        require:true
    },
    donoremail:{
        type:String,
        require:true
    },
    number:{
        type:Number,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    massage:{
        type:String,
        require:true
    },
    select:{
        type:String,
        require:true
    }
})

module.exports=mongo.model("useracceptrequest",useracceptrequest);