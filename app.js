//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//(1) create a db
//creating a mongoDB schema
mongoose.connect("mongodb://localhost:27017/todolistDB",{ useUnifiedTopology: true ,useNewUrlParser:true});
const itemsSchema = {
  name :String
};
//creatig a collection
const Item = mongoose.model("Item", itemsSchema);

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List =mongoose.model("List",listSchema);

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
 console.log("1");
 Item.find({},function(err, foundItems){

  res.render("list", {kindOfDay:aDay , newListItems:foundItems});
  console.log("2");
 });
 // load the list.ejs with the day and the list of items
 console.log("3");
});


app.post("/",function(req,res){
  item= req.body.newItem;
  //console.log(req.body.newItem);
  var arr = [{ name:item }];
  Item.insertMany(arr, function(error, docs) {});
  res.redirect("/");
});

app.post("/delete" , function(req,res){
  let toDltId = req.body.checkbox;
  Item.findByIdAndRemove(toDltId , function(err){});
  res.redirect("/");
});

app.get("/:tdListTitle",function(req,res){
  List.findOne({name:req.params.tdListTitle},function(err,result){
    if(!result){
      // create a new list
      let customListName = req.params.tdListTitle;
      const list = new List({
        name: customListName,
        items:[]
      });
      list.save();
      res.redirect("/"+tdListTitle);
    }
    else{
      // this list already exist, show it.
      res.render("list", {kindOfDay:result.name , newListItems:result.items});
    }
  });

});

app.listen(3000, function(){
  console.log("running on port 3000");
});
