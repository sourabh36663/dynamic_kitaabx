var express = require("express");
var router = express.Router();
var Subject = require("../models/subject.js");

router.get("/", function(req, res){
    Subject.find({}, function(err, subjects){
        if(err){
        console.log("error");
    }else{
        res.render("index", {subjects: subjects});
    }
    });
});

//NEW ROUTE
router.get("/new", isLoggedIn, function(req,res){
    res.render("new");
});

//CREATE ROUTE
router.post("/", isLoggedIn, function(req, res){
    console.log(req.user.fName+" "+req.user.lName);
    var author = {
        id:req.user._id,
            name: req.user.fName+" "+req.user.lName
    };
    var finalSubject = req.body.subject;
    finalSubject.author = author;
    req.body.subject.body = req.sanitize(req.body.subject.body);
    Subject.create(finalSubject, function(err, newSubject){
        if(err){
            console.log(err);
            res.render("new");
        }else{
            res.redirect("/subjects");
            console.log(newSubject);
        }
        
    });
});

//SHOW ROUTE
router.get("/:id", function(req, res){
  Subject.findById(req.params.id, function(err, foundSubject){
      if(err){
          res.redirect("/subjects");
      }else{
          res.render("show", {subject: foundSubject});
      }
  });
});

//EDIT ROUTE
router.get("/:id/edit", checkSubjectOwnership, function(req, res) {
  Subject.findById(req.params.id, function(err, foundSubject){
      if(err){
          res.redirect("back");
      }else{
        res.render("edit", {subject: foundSubject});
      }
          
  });
});

//UPDATE ROUTE
router.put("/:id", checkSubjectOwnership, function(req, res){
    req.body.subject.body = req.sanitize(req.body.subject.body);
    Subject.findByIdAndUpdate(req.params.id, req.body.subject, function(err, updatedSubject){
        if(err){
            res.redirect("/subjects");
        }else{
            res.redirect("/subjects/"+req.params.id);            
        }
    });
});

//DELETE ROUTE
router.delete("/:id", checkSubjectOwnership, function(req, res){
   Subject.findByIdAndRemove(req.params.id, function(err){
       if (err) {
        res.redirect("/subjects");   
       }else{
           res.redirect("/subjects");
       }
   }); 
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

function checkSubjectOwnership(req, res, next){
  // does the user logged in 
  if(req.isAuthenticated()){
      Subject.findById(req.params.id, function(err, foundSubject){
      if(err){
          req.flash("error", "Not Found!");
          res.redirect("back");
      }else{
        // does user own the subject
          if(foundSubject.author.id.equals(req.user._id)){
              next();
          } else{
              req.flash("error", "You don't have permission to do that");
              res.redirect("back");
          }
      }  
    });
    }else{
        res.redirect("back");
    }
}

module.exports = router;