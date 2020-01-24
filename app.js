//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
var items=[];

app.get("/", function(req,res){

 var today=new Date();
 var currentDay= today.getDay();
 var day="";

 var options = {
   weekday: "long",
   day:"numeric",
   month:"long"
 };
 var aDay= today.toLocaleDateString("en-US", options);


 res.render("list",{kindOfDay:aDay , newListItems:items});
});

app.post("/",function(req,res){
  item= req.body.newItem;
  console.log(req.body.newItem);
  items.push(item);
  res.redirect("/");
});


app.listen(3000, function(){
  console.log("running on port 3000");
});
