const express=require("express")
const app=express();
const mongo=require("mongoose");
require("./models/doner_rigister")

const donorss = mongo.model("donors")
cloudinary=require("cloudinary")
require("./cloudinary")
const cors=require("cors")
const bodyParser=require("body-parser");
const jwt=require("jsonwebtoken")
const nodemiler=require("nodemailer")
require("dotenv").config();
require("./models/request")
const upload=require("./multer")
const db2=mongo.model("request")
const auth=require("./auth");

const { db } = require("./models/city");
require("./models/city"); 
const db1=mongo.model("city")

require("./models/foodrequest")

const requestfood=mongo.model("requestfood")
//middileware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors())

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
  });

  //database connection
  require("./mongo")
 
  //routes   

  app.use("/",require("./routes/adminregister"))
  
   
 
app.post("/addcity", upload.single("filee"), async (req, res) => {
  try {
    console.log(req.file);
    const result = await cloudinary.v2.uploader.upload(req.file.path, { quality: "20" });
    console.log(result);

    const data = new db1();
    data.name = req.body.catogary;
    data.bgimg = result.secure_url;
    data.lockdown = req.body.lock;

    await data.save();
    res.send("data is saved");
  } catch (error) {
    console.error(error);
    res.status(500).send("data is not saved");
  }
});


app.get("/getdata",async(req,res)=>{
  try {
    const data= await db1.find();
    res.send(data)
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Failed to get data"});
  }
})


app.post("/delete",async(req,res)=>{
  try {
    console.log(req.body.id)
    await db1.findByIdAndDelete(req.body.id);
    res.send("delete");
  } catch (error) {
    console.error(error);
    res.status(500).send("not delete");
  }
})


app.post("/getid",async(req,res)=>{
  try {
    const data= await db1.findById(req.body.id);
    res.send(data)
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Failed to get data by id"});
  }
})

 app.post("/updateeeee",upload.single("image"),async(req,res)=>{
  try {
    if(!req.file){
      await db1.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.status,lockdown:req.body.status1}});
      res.send("update");
    } else {
      const result= await cloudinary.v2.uploader.upload(req.file.path,{quality:"20"});
      await db1.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.status,lockdown:req.body.status1,bgimg:result.secure_url}});
      res.send("update");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("not update");
  }
 })


 app.post("/donors",async(req,res)=>{
  try {
    const data1= await donorss.find({email:req.body.email})
    
    if(data1.length==1){
      res.send("This Email is already exist")
    } else {
      const data= new donorss();
      data.name=req.body.name;
      data.email=req.body.email;
      data.password=req.body.password;
      data.number=req.body.number;

      await data.save();
      res.send("Registration Success");
      console.log(req.body)
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Registration Failed");
  }
 })

//  app.post("/donors/signin", async (req, res) => {
//   const donor = await donorss.findOne({ email: req.body.email });

//   if (!donor) {
//     return res.send({
//       msg: "Enter Email is Invalid",
//       token: "",
//       id: "",
//       name: "",
//       email: "",
//       number: "",
//       login: false
//     });
//   }
//   if (donor.password !== req.body.password) {
//     return res.send({
//       msg: "Incorrect Password",
//       token: "",
//       id: "",
//       name: "",
//       email: "",
//       number: "",
//       login: false
//     });
//   }
//   const token = jwt.sign({
//     id: donor._id,
//     name: donor.name,
//     number: donor.number,
//     email: donor.email,
//     login: true
//   }, "xyz");

//   res.send({
//     msg: "log In Success",
//     token: token,
//     id: donor._id,
//     name: donor.name,
//     email: donor.email,
//     number: donor.number,
//     login: true
//   });
// });
       
app.post("/donors/signin", async (req, res) => {
  try {
    const donor = await donorss.findOne({ email: req.body.email });

    if (!donor) {
      return res.send({
        msg: "Enter Email is Invalid",
        token: "",
        id: "",
        name: "",
        email: "",
        number: "",
        login: false
      });
    }
    if (donor.password !== req.body.password) {
      return res.send({
        msg: "Incorrect Password",
        token: "",
        id: "",
        name: "",
        email: "",
        number: "",
        login: false
      });
    }
    
    const token = jwt.sign({
      id: donor._id.toString(),
      name: donor.name,
      number: donor.number,
      email: donor.email,
      login: true
    }, "xyz");

    res.send({
      msg: "log In Success",
      token: token,
      id: donor._id.toString(),  // Convert ObjectId to string
      name: donor.name,
      email: donor.email,
      number: donor.number,
      login: true
    });
  } catch (error) {
    console.error("Donor signin error:", error);
    res.status(500).send({
      msg: "Server Error",
      token: "",
      id: "",
      name: "",
      email: "",
      number: "",
      login: false
    });
  }
});

app.get("/userdata",auth,(req,res)=>{

  res.send(userdata)
 // console.log(userdata)
})

app.post("/request",async(req,res)=>{
  try {
    const data1= await donorss.find()
    const arry=data1.map((i)=>{
      return i.email
    })
    const emails=arry.join(",")
    const data=new db2();

    data.name=req.body.name;
    data.email=req.body.email;
    data.number=req.body.number;
    data.address=req.body.address;
    data.massage=req.body.massage;
                
    await data.save();
    res.send("Request has be listed");

    let trans=nodemiler.createTransport({
      service:"gmail",
      auth:{
          user:process.env.ID,
          pass:process.env.PASS
      }
    }) 
    //step2
    let mailOptions={
     from:'covidweb87@gmail.com',
      to:emails,
      subject:"New Blood Request",
      text:`Name: ${req.body.name}
    Email: ${req.body.email}
    Number: ${req.body.number}
    Address: ${req.body.address}
    Message: ${req.body.massage}
      `
    };

    //step 3
    trans.sendMail(mailOptions,(err,data)=>{
      if(err){
          console.log("something is wrong email does not send !",err)
      } else {
          console.log("Hurry! Email Send!!!!!")
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Request failed");
  }
})

app.get("/getrequest",async(req,res)=>{
  try {
    const data=await db2.find();
    res.send(data)
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Failed to get requests"});
  }
})


require("./models/useracceptrequest")
const db3=mongo.model("useracceptrequest")

app.post("/useracceptrequest",async(req,res)=>{
  try {
    const data=await db2.findById(req.body.id);
    const data2= new db3();

    data2.name=data.name
    data2.useremail=req.body.email
    data2.donoremail=data.email
    data2.address=data.address
    data2.number=data.number
    data2.massage=data.massage
    
    await data2.save();
    res.send({msg:"Request accepted"});

    await db2.findByIdAndDelete(req.body.id);
    console.log("delete");

    const donor = await donorss.find({email:req.body.email});
    
    let trans=nodemiler.createTransport({
      service:"gmail",
      auth:{
          user:process.env.ID,
          pass:process.env.PASS
      }
    }) 
    //step2
    let mailOptions={
     from:'covidweb87@gmail.com',
      to:data.email,
      subject:"testing nodemiler to send mail",
      text:`your Request has accepted by ${donor[0].name}
      if you want to contents him/his Below is their Details
      Email: ${donor[0].email}
      Number: ${donor[0].number}
      `
    };
    
    //step 3
    trans.sendMail(mailOptions,(err,data)=>{
      if(err){
          console.log("something is wrong email does not send !",err)
      } else {
          console.log("Hurry! Email Send!!!!!")
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({msg: "Request accept failed"});
  }
})


app.post("/useracceptrequest2",async(req,res)=>{
  try {
    const data=await requestfood.findById(req.body.id);
    const data2= new db3();

    data2.name=data.name
    data2.useremail=req.body.email
    data2.donoremail=data.email
    data2.address=data.address
    data2.number=data.number
    data2.massage=data.massage
    data2.select=data.select
    
    await data2.save();
    res.send({msg:"Request accepted"});

    await requestfood.findByIdAndDelete(req.body.id);
    console.log("delete");

    const donor = await donorss.find({email:req.body.email});
    
    let trans=nodemiler.createTransport({
      service:"gmail",
      auth:{
          user:process.env.ID,
          pass:process.env.PASS
      }
    }) 
    //step2
    let mailOptions={
     from:'covidweb87@gmail.com',
      to:data.email,
      subject:"",
      text:`your Request has accepted by ${donor[0].name}
      if you want to contents him/his Below is their Details
      Email: ${donor[0].email}
      Number: ${donor[0].number}
      `
    };
    
    //step 3
    trans.sendMail(mailOptions,(err,data)=>{
      if(err){
          console.log("something is wrong email does not send !",err)
      } else {
          console.log("Hurry! Email Send!!!!!")
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({msg: "Request accept failed"});
  }
})


app.get("/useracceptrequestview", async(req,res)=>{
  try {
    const data = await db3.find();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Failed to get user accept requests"});
  }
})

app.post("/deleteuserrequest",async(req,res)=>{
  try {
    await db3.findByIdAndDelete(req.body.id);
    res.send({msg:"Request Remove"});
  } catch (error) {
    console.error(error);
    res.status(500).send({msg:"Request Remove Failed"});
  }
})

app.put('/updateuser', async(req,res) => {
  try {
    const {userId} = req.params;
    const {name, email, password, number} = req.body;
    const updatedData = {};
    
    if(name) updatedData.name = name;
    if(email) updatedData.email = email;
    if(password) updatedData.password = password;
    if(number) updatedData.number = number;

    const updatedDonor = await donorss.findByIdAndUpdate(userId, updatedData, {new : true});

    return res.status(200).json({msg : "Donor Updated Successfully", donorss : updatedDonor});


  } catch (error) {
    console.log(error);
    res.status(500).json({wrn : "Internal Server Error"});
  }
})

// app.put("/updateuser",async(req,res)=>{
//   try {
//     const data = req.body;
//     console.log("Request data:", data);
    
//     // Validate request data structure (expecting array [userData, userId])
//     if (!data || !Array.isArray(data) || data.length < 2 || !data[0] || !data[1]) {
//       return res.status(400).send({error: "Invalid request data structure"});
//     }
    
//     const userData = data[0];  // {name, email, password, number}
//     const userId = data[1];    // user id
    
//     // Validate required fields
//     if (!userData.name || !userData.email || !userData.password || !userData.number) {
//       return res.status(400).send({error: "Missing required user data (name, email, password, number)"});
//     }
    
//     // Check if donor exists
//     const existingDonor = await donorss.findById(userId);
//     if (!existingDonor) {
//       return res.status(404).send({error: "Donor not found"});
//     }
    
//     // Update donor (email should not be updated as it's disabled in frontend)
//     await donorss.updateOne({_id: userId}, {
//       $set: {
//         name: userData.name,
//         password: userData.password,
//         number: userData.number
//         // Note: email is not updated as it's disabled in frontend
//       }
//     });

//     const token = jwt.sign({
//       name: userData.name,
//       id: userId,
//       email: userData.email, 
//       password: userData.password,
//       number: userData.number,
//       login: true
//     }, "xyz");
    
//     // Response format that matches what frontend expects
//     res.send({
//       name: userData.name,
//       id: userId,
//       email: userData.email,
//       password: userData.password,
//       number: userData.number,
//       token: token,
//       login: true
//     });

//     console.log("Donor updated successfully:", {
//       id: userId,
//       name: userData.name,
//       email: userData.email,
//       number: userData.number
//     });
//   } catch (error) {
//     console.error("Update user error:", error);
//     res.status(500).send({error: "User update failed"});
//   }
// })


app.get("/getinfo",async(req,res)=>{
  try {
    const data1=await donorss.find();
    const data2=await db1.find();
    const data3=await db2.find();

    res.send({donors:data1.length,citys:data2.length,request:data3.length})
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Failed to get info"});
  }
})


app.get("/getdonors",async(req,res)=>{
  try {
    const data=await donorss.find();
    res.send(data)
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Failed to get donors"});
  }
})
  app.post("/deletedonors",async(req,res)=>{
  try {
    await donorss.findByIdAndDelete(req.body.id);
    res.send("delete");
  } catch (error) {
    console.error(error);
    res.status(500).send("not delete");
  }
})
  


    app.post("/food",async(req,res)=>{
  try {
    const data1= await donorss.find()
    const arry=data1.map((i)=>{
      return i.email
    })
    const emails=arry.join(",")

    const data=new requestfood()

    data.name=req.body.data1.name,
    data.email=req.body.data1.email,
    data.address=req.body.data1.address,
    data.number=req.body.data1.number,
    data.massage=req.body.data1.massage,
    data.select=req.body.selet,
    console.log(req.body)
    
    await data.save();
    res.send({msg:"Request has been sent!"});

    let trans=nodemiler.createTransport({
      service:"gmail",
      auth:{
          user:process.env.ID,
          pass:process.env.PASS
      }
    }) 
    //step2
    let mailOptions={
     from:'covidweb87@gmail.com',
      to:emails,
      subject:"New Food Request",
      text:`Name: ${req.body.data1.name}
            Email: ${req.body.data1.email}
            Number: ${req.body.data1.number}
            Address: ${req.body.data1.address}
            Message: ${req.body.data1.massage}
           Food Seleted:${req.body.selet}
      `
    };
    
    //step 3
    trans.sendMail(mailOptions,(err,data)=>{
      if(err){
          console.log("something is wrong email does not send !",err)
      } else {
          console.log("Hurry! Email Send!!!!!")
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({msg:"Request failed"});
  }
})


    app.get("/getfood",async(req,res)=>{
  try {
    const data=await requestfood.find();
    res.send(data)
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Failed to get food requests"});
  }
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send({ error: "Route not found" });
});
      
      
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).send({ 
    error: "Internal server error", 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

app.listen( process.env.PORT||3000,()=>{console.log("server is ON!")})
// console.log(process.cwd())

// Export the app for Vercel
module.exports = app;