const route=require("express").Router();
const mongo=require("mongoose");
const { findOne } = require("../models/register");
const jwt=require("jsonwebtoken")
require("../models/register"); 
const auth=require("../auth")
const c1=mongo.model("admin1")
const upload=require("../multer")
const cloudinary=require("cloudinary")
require("../cloudinary")

  


route.post("/register", async (req, res) => {
  try {
    const { username, email, password, image } = req.body;
    const data = new c1();
    data.username = username;
    data.email = email;
    data.password = password;
    data.image = image;
    await data.save();
    res.send({ msg: "data is saved!" });
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

route.post("/signin", async(req,res)=>{
    try {
        const {email,password}=req.body;

        if(email=="" || password==""){
            return res.send({msg:"plz fill the field"})
        }
      
        const data=await c1.findOne({email:email});
        if(!data){
            return res.send({msg:"email is invalid"})
        } else {
            if(password!=data.password){
               return res.send({msg:"Incorrent password"})
            } else {
                const token=jwt.sign({username:data.username,
                          id:data._id,
                          email:data.email,
                          password:data.password,
                          image:data.image,
                             
                }, "xyz")
                
                res.send({token:token,username:data.username,
                    id:data._id,
                    email:data.email,
                    password:data.password,
                    image:data.image,})
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({msg:"Server Error"});
    }
})


route.get("/userdata",auth,(req,res)=>{

    res.send(userdata)
   // console.log(userdata)
})


route.post("/userupdate",upload.single("image"),auth, async(req,res)=>{
    try {
        if(req.file){
            
            const result= await cloudinary.v2.uploader.upload(req.file.path,{quality:"20"})
            console.log(result)
            
            const data=await c1.findOne({email:userdata.email});
            
            await c1.updateOne({_id:req.body.id},{$set:{image:result.secure_url,username:req.body.Profilename,password:req.body.Password}})

            const token= jwt.sign({username:data.username,
                id:data._id,
                email:data.email, 
                password:data.password,
                image:result.secure_url,
                   
            }, "xyz")
            res.send(token)

        } else {
                
            const data=await c1.findOne({email:userdata.email});
            
            await c1.updateOne({_id:req.body.id},{$set:{username:req.body.Profilename,password:req.body.Password}})

            const token= jwt.sign({username:data.username,
                id:data._id,
                email:data.email, 
                password:data.password,
                image:data.image,
                   
            }, "xyz")
            res.send(token)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({error: "User update failed"});
    }
})


module.exports=route;