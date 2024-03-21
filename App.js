const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
// Schema's
const UserData = require("./model/User.js");
const TaskData=require("./model/List.js");
const passport=require("./middleWare/passport.js")
const jwt=require('jsonwebtoken');




app.use(express.json());
app.use(cors({ origin: "*" }));
// mongoose Database connection

mongoose
  .connect("mongodb://127.0.0.1:27017/TodoList")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.post("/reg", async(req,res) => {
  const {name, email, phone, password} = req.body;
  const data = await UserData.findOne({ email: email });
  if (data) {
    return res.send("user already exists");
  }

  const user = new UserData({
    name: name,
    email: email,
    phone: phone,
    password: password, 
  });
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(user.password,salt,async(err,hash)=>{
        user.password=hash;
        await user.save();
        res.send("sent success").status(200)
    })
  })
});
app.post("/log",async(req,res)=>{
    const {email,password}=req.body;
    console.log(email,password);
    const userFOund=await UserData.findOne({email:email});
    if(!email){
        return res.send("email Not Found");
    }
    bcrypt.compare(password,userFOund.password).then(yes=>{
        if(yes){
            // res.send(userFOund);
            const payload={
                user:{
                    id:userFOund.id
                }
            }
            console.log(payload)
            jwt.sign(payload,"AHVYEjidew0",{expiresIn:3600000},(err,token)=>{
                if(err){throw err}
                return res.json({status:200,token:token});
            })  
            console.log(payload)

        }else{
            return res.send("Wrong Credentials")
        }
    })
})

app.get("/profile",passport,async(req,res)=>{
  // const {token}=req.queraway;
  try {
    const send=await UserData.findById({_id:req.user.id});
    res.json(send);
  } catch (error) { 
    res.send(error);
  }
})

app.post("/task",async(req,res)=>{
  const date=new Date();
    const hours=date.getHours()>12? date.getHours()-12:date.getHours() 
    const Mer= date.getHours()>12 ? "Pm":"Am";
    var min=(date.getMinutes()<10 )? "0"+date.getMinutes():date.getMinutes();
    const time=hours+":"+min+" "+Mer;
  const {emailprops,task}=req.body;
  // console.log(emailprops+" "+task+" "+time);
  const taskAdded=new TaskData({
    email:emailprops,
    task:task,
    time:time
  })
  const sent=await taskAdded.save();
  res.json({status:200,sent});
  console.log(sent);
})
app.get('/get-task',async(req,res)=>{
  console.log(req.query.emailprops);
  try {
    const data=await TaskData.find({email:req.query.emailprops})
    // console.log(datastat);
    res.json({status:200,data});
  } catch (error) {
    
  }
})
app.delete("/remove-task/:id",async(req,res)=>{
  const id=req.params.id;
  try {
  await TaskData.findByIdAndDelete(id);
  res.status(200);
  } catch (error) {
    console.log(error);
  }
})
app.post("")
app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});

// http://localhost:4000/




