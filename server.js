
//------------------------------------------------
// required for minimal server and parameters 

var express  = require('express');
var app      = express();
var port     = process.env.PORT || 5000;

var bodyParser   = require('body-parser');
var path = require('path');

var engines = require('consolidate');

//----------------------------------------------

//---------------------------------------------
// required for passport and express session

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');

//var npass=require('./passport')(passport); // pass passport for configuration

//----------------------------------------------

//----------------------------------------------------
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
//-----------------------------------------------------

//---------------------------------------------------------
// required for passport
app.use(session({
    secret: 'inthemiddleofthenight', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
//----------------------------------------------------------

//-------------------------------------------------------
// routing section ... 

app.use(express.static( path.join(__dirname,'/')));
app.engine('html', require('ejs').renderFile);

var Npass=true;

app.get('/',function(req,res){
    console.log("Npass ",Npass);
    if(Npass)
     {console.log("require ./passport.js ");
      npass=require('./passport')(app,passport,res); //make sure ./passport.js only loaded once
      Npass=false;
     } 
    console.log("trying to render start.html");
    res.render('start.html');
   }); 


//-----------------------------------------------

//-------------------------------------------------------
// providing js and css files 

app.get('/jquery.min.js',function(req,res){
    res.render('jquery.min.js');
});

app.get('/masonry.pkgd.min.js',function(req,res){
    res.render('masonry.pkgd.min.js');
});

app.get('/imagesloaded.pkgd.min.js',function(req,res){
    res.render('imagesloaded.pkgd.min.js');
});

app.get('/react.js',function(req,res){
    res.render('react.js');
});

app.get('/react-dom.js',function(req,res){
    res.render('react-dom.js');
});

app.get('/pinclone.js',function(req,res){ // ES5 version of pinclone.jsx
    res.render('pinclone.js');
});

app.get('/all.css',function(req,res){
    res.render('all.css');
});

//------------------------------------------------------------
// ES6 support for testing ; 
//after the ES5 code has been generated no more required

app.get('/babel.min.js',function(req,res){
    res.render('babel.min.js');
});
app.get('/pinclone.jsx',function(req,res){
    res.render('pinclone.jsx');
});
//============================================================

// launch 

app.listen(port);
console.log('server runs on port  ' + port);

//=================================================

require('./routes.js')(app, passport); // handle or route Twitter authentification only
//require('./ntwitter.js')(app); // for username verification








