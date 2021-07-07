//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encryption = require("mongoose-encryption");
const SecretsDB = "Secret";
mongoose.connect("mongodb://localhost:27017/"+SecretsDB,{useNewUrlParser:true,useUnifiedTopology:true});
const userSchema = new mongoose.Schema({
  email:{type:String,required:[true,"not null email"]},
  password:{type:String,required:[true,"not null password"]}
});

userSchema.plugin(encryption, { secret:process.env.SECRET, encryptedFields: ['password'] });

const userModel = mongoose.model("User",userSchema);


app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

// app.route("/").
// get(function(req,res){
//
// });
app.get("/",function(req,res){
  res.render("home");
})
app.get("/logout",function(req,res){
  res.redirect("/");
})

app.get("/register",function(req,res){
  res.render("register");
})
app.post("/register",function(req,res){
  const newUser = new userModel({
    email:req.body.username,
    password:req.body.password
  })
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets",{});
      console.log("Add User Success");
    }
  });
})

app.get("/login",function(req,res){
  res.render("login");
})
app.post("/login",function(req,res){
  userModel.findOne({email:req.body.username},function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === req.body.password){
            res.render("secrets",{});
          }
        }
      }
  })
})


app.listen(process.env.PORT||3000,function(req,res){
  console.log("Port on 3000");
})
