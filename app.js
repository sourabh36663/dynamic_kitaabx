var express     =    require("express");
var app         =    express();
var methodOverride = require("method-override");
var expressSanitizer =  require("express-sanitizer");
var flash = require("connect-flash");
var passport =      require("passport");
var localStrategy = require("passport-local");
var bodyParser  =   require("body-parser");
var mongoose    =   require("mongoose");
var User        =   require("./models/user");
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);


var store = new MongoDBStore(
  {
    uri: 'mongodb://bad.host:27000/connect_mongodb_session_test?connectTimeoutMS=10',
    databaseName: 'connect_mongodb_session_test',
    collection: 'mySessions'
  },
  function(error) {
    // Should have gotten an error
  });
  
app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

mongoose.connect("mongodb://sourabh:sourabhb1@ds145881.mlab.com:45881/kitaabxfirst", { useNewUrlParser: true });


//requiring routes
var subjectRoutes = require("./routes/subjects.js"),
    indexRoutes   = require("./routes/index.js");

//app config

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.yearInApp = [1,2,3,4];
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    res.locals.branchInApp = [
        {sForm: "CS", title: "Computer Science"},
        {sForm: "IT", title: "Information Technology"},
        {sForm: "EX", title: "Electronics and Telecommunication"},
        {sForm: "ME", title: "Mechanical"},
        {sForm: "MX", title: "Mechatronics"},
        {sForm: "CV", title: "Civil"}
        ];
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/subjects", subjectRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server running!");
})