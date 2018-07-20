var express     =    require("express");
var app         =    express();
var bodyParser  =    require("body-parser");
var mongoose    =    require("mongoose");

//app config
mongoose.connect("mongodb://localhost:27017/db_namet", { useNewUrlParser: true });     
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


//Mongoose/model config
var subjectSchema = new mongoose.Schema({
    title: String,
    url: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    },
    year: Number,
    branch: String
});
var Subject = mongoose.model("Subject", subjectSchema);



//RESTful routes

//INDEX ROUTE
app.get("/", function(req, res){
    Subject.find({}, function(err, subjects){
        if(err){
        console.log("error");
    }else{
        res.render("index", {subjects: subjects});
    }
    });
});

//NEW ROUTE
app.get("/new", function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/",function(req, res){
    Subject.create(req.body.subject, function(err, newSubject){
        if(err){
            console.log(err);
            res.render("new");
        }else{
            res.redirect("/");
        }
        
    });
});

//SHOW ROUTE
app.get("/:id", function(req, res){
  Subject.findById(req.params.id, function(err, foundSubject){
      if(err){
          res.redirect("/");
      }else{
          res.render("show", {subject: foundSubject});
      }
  });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server running!");
})