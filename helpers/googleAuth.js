const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User')

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {

  
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



passport.use(new GoogleStrategy({
    clientID: "764424078744-9jnvjdgdc83o8ppr9brdctlmsj6ev3q8.apps.googleusercontent.com",
    clientSecret: "Ur2kz6YjsqvNa3_SgqM2xkxB",
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
 async function (accessToken, refreshToken, profile, done) {
    console.log(profile)

    console.log(profile.id)
    console.log(profile.displayName)
    console.log(profile._json.email)
    let userData ={
      googleId: profile.id,
      username : profile.displayName ,
      email :profile._json.email ,
     }
      await User.findOneAndUpdate({ email: profile._json.email },userData,{ upsert: true, new: true, setDefaultsOnInsert: true })
             .then((result)=>{
              return done(null, result);
            })
            .catch((err)=>{
              return done(err);
            })
     
  }
));