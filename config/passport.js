var bCrypt = require("bcrypt-nodejs");

module.exports = function(passport, user, db) {
  var User = user;
  var JwtStrategy = require('passport-jwt').Strategy;
  const ExtractJwt = require('passport-jwt').ExtractJwt;
  var LocalStrategy = require("passport-local").Strategy;


  //serialize
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize user
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },

      function(req, email, password, done) {
        // creating a hashed password for storing
        var generateHash = function(password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };

        db.User.findOne({
          where: {
            email: email
          }
        }).then(function(user) {
          if (user) {
            return done(null, false, {
              message: "That email is already taken"
            });
          } else {
            var userPassword = generateHash(password);

            var data = {
              email: email,
              password: userPassword
            };

            db.User.create(data).then(function(newUser) {
              if (!newUser) {
                return done(null, false);
              }
              if (newUser) {
                return done(null, newUser);
              }
            });
          }
        });
      }
    )
  );

  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },

      function(req, email, password, done) {
        var User = user;

        var isValidPassword = function(userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };
        User.findOne({ where: { email: email } })
          .then(function(user) {
            if (!user) {
              return done(null, false, { message: "Email does not exist" });
            }

            if (!isValidPassword(user.password, password)) {
              return done(null, false, { message: "Incorrect password." });
            }

            var userinfo = user.get();
            console.log("user info ------- " + userinfo);
            return done(null, userinfo);
          })
          .catch(function(err) {
            console.log("Error:", err);

            return done(null, false, {
              message: "Something went wrong with your Signin"
            });
          });
      }
    )
  );

  
// Setup options for JWT Strategy
var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.PASSPORT_SECRET
};


// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  db.User.findOne({
    where: {
      email: email
    }
  }).then(function(user) {
    if (!user) {
      return done(null, false, { message: "Email does not exist" });
    }
    if (user) {
      done(null, user);
}
  });

});

passport.use(jwtLogin);

};
