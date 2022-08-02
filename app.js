//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// Require mongoose package after installation
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// create the mongoose connection to our mongodb database using the name of the database to creat/connect to
mongoose.connect("mongodb://localhost:27017/todolistDB");

// create the itemsSchema (database schema)
const itemsSchema = {
  name: String
};

// create the mongoose model off of the itemsSchema
const Item = mongoose.model("Item", itemsSchema);

// create three documents using mongoose model for default documents
const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

// put created document default items into an array
const defaultItems = [item1, item2, item3];



app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      //use mongoose insertMany method to insert the array of default docs into the database.
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.")
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }

  });

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
