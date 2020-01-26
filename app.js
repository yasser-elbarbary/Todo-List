//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var items=[];

//(1) create a db
//creating a mongoDB schema
mongoose.connect("mongodb://localhost:27017/todolistDB",{ useUnifiedTopology: true ,useNewUrlParser:true});
const itemsSchema = {
  name :String
};
//creatig a collection
const Item = mongoose.model("Item", itemsSchema);


//(3) in get, send items
//(4) in post, get req.newItem and add it to db then return to (2)


app.get("/", function(req,res){
 // creatig date format
 var today=new Date();
 var options = {
   weekday: "long",
   day:"numeric",
   month:"long"
 };
 var aDay= today.toLocaleDateString("en-US", options);

 //(2) load items=[] with db.items.name
 items=[];
 Item.find({},function(err, foundItems){
   foundItems.forEach(function(element){
     console.log(element.name);
     items.push(element.name);
   });
   console.log(foundItems);
 });
 // load the list.ejs with the day and the list of items
 res.render("list", {kindOfDay:aDay , newListItems:items});
});


app.post("/",function(req,res){
  item= req.body.newItem;
  console.log(req.body.newItem);
  var arr = [{ name:item }];
  Item.insertMany(arr, function(error, docs) {});
  res.redirect("/");
});


app.listen(3000, function(){
  console.log("running on port 3000");
});
