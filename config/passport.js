var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require("../models/User");

passport.serializeUser((user, next) => next(null, user))

passport.deserializeUser(async function (user, done) {
  try {
    if (user.type === 'local') {
      const userLogin = await User.findOne({ Email: user.Email });
      if (userLogin) {
        return done(null, userLogin);
      }
      return done('invalid');
    } else {
      const userLogin = await User.findOne({ Emp_Code: user.Emp_Code });
      if (userLogin) {
        return done(null, userLogin);
      }
      return done('invalid');
    }
  } catch (err) {
    return done(err);
  }
});

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
}, async (req, email, password, done) => {
  try {
    let user = await User.findOne({ Email: email });

    if (!user) {
      console.log("No user found");
      return done(null, false, { message: 'No user found' });
    }

    const isVerified = bcrypt.compareSync(password, user.Password);

    if (isVerified) {
      if (user.Admin) console.log("Admin logged in!");
      else
        console.log("Logged in successfully!");

      return done(null, user);
    }
    else {
      console.log("Password incorrect");
      return done(null, false, { message: 'Password incorrect' });
    }
  } catch (err) {
    console.error("Error during authentication", err);
    return done(err);

  }
}));
