const jwt=require("jsonwebtoken");


const auth= async(req,res,next)=>{
    try {
        const token=req.header("token"); 

        if(!token){
            return res.send({msg:"token is not avilable"})
        }

        const tokenvarify=jwt.verify(token,"xyz")

        if(!tokenvarify){
            return res.send({msg:"token is not varify-token"})
        }

        userdata=tokenvarify
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send({msg:"Invalid token"});
    }
}

module.exports=auth;