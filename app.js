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
var today=new Date();
function getDay() {
  var options = {
    weekday: "long",
    day:"numeric",
    month:"long"
  };
  return today.toLocaleDateString("en-US", options);
}

app.get("/", function(req,res){
 // creatig date format

 var aDay= getDay();

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
  itemName= req.body.newItem;
  listName = req.body.button;
  //console.log(req.body.newItem);
  const item = new Item({
    name: itemName
  });
  //if it is a eneric list then just save the item in items db
  if(listName===getDay()){
    item.save();
    res.redirect("/");
  }
  else{
    console.log(getDay());
    console.log(listName);

    // if itis a custom list save it in the custom db
    console.log("adding  to custom list...");
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      console.log("adding  to custom list DONE");
      res.redirect("/"+listName);
    });
  }
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
      res.redirect("/"+req.params.tdListTitle);
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
