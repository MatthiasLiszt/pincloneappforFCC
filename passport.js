// load all the things we need
var TwitterStrategy  = require('passport-twitter').Strategy;


// load up the user model
//var User       = require('./user');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

var userId;
var authenticated=false;

module.exports = function(app,passport,Res) {

     console.log("MODULE ./passport.js executing");

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
   
    passport.use(new TwitterStrategy({
       consumerKey: configAuth.twitterAuth.consumerKey,
       consumerSecret: configAuth.twitterAuth.consumerSecret,
       callbackURL: configAuth.twitterAuth.callbackURL,
       passReqToCallback: true
      },
     function(accessToken, refreshToken, profile, done) {
       console.log("./passport.js executing callback of passport.use ");
               
       console.log("profile "+profile);
       console.log("profile.id "+profile.id);
       console.log("accessToken "+accessToken);
       console.log("refreshToken "+refreshToken);  

       userId=profile; // unique authentification code for the user 
       if(userId)
        {authenticated=true;
         //Res.redirect('/'); // set commented because it crashes with error message
        } 
                              

      }));

    // get LOG-STATUS  =====================

    app.get('/getlogstat',function(req,res){
        res.json({authenticated: authenticated, userId: userId});     
    });
 
    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        authenticated=false
        userId=undefined
        req.logout();
        res.redirect('/');
    });

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    
    /*
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    }); 
    */

};


