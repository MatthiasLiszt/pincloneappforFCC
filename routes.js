
var token=0
var uname="nobody"
var verifier=0

var usign 


module.exports = function(app, passport) {

// normal routes ===============================================================

    // PROFILE SECTION =========================
    app.get('/profile', function(req, res) {
       console.log(req.user+"successful logged in");
       //res.render('profile.html',{uname: req.user});
       res.render('profile.html');
    });

     

   
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', function(req,res){
            res.render('warning.html');       
          });
        
        app.get('/twitterauth',passport.authenticate('twitter'));        
 
        // handle the callback after twitter has authenticated the user
        
        app.get('/auth/twitter/callback', 
               passport.authenticate('twitter',{failureRedirect: '/account'}),
           function(req,res){
            console.log('parameters')
            console.log('token = '+req.query.oauth_token)
            console.log('verifier = '+req.query.oauth_verifier)
            console.log('user = '+req.user)
            token = req.query.oauth_token
            verifier = req.query.oauth_verifier
            res.redirect('/')   
            //res.json(req.user);
        });    
           



// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================


    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter',
            passport.authorize('twitter',{failureRedirect: '/account'}));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',function(req,res){
                console.log("route.js username "+req.user); 
                res.redirect('/');
        });

        app.get('/account',function(req,res){
            res.send("An error occured !");
        });

};

