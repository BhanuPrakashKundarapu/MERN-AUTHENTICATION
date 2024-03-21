const mongoose=require('mongoose');
const ListSchemas=mongoose.Schema({
    email:{
      type:String,
      required:true,
      // unique:true
    },
    task:{
      type:String,
      required:true,
      // unique:true
    },
    time:{
      type:String,
      required:true,
      // unique:true
    }
  })
  const Task=mongoose.model("Task",ListSchemas);
  module.exports =Task;
  
  