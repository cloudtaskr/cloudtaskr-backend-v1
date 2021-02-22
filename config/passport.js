const User = require('../models/user-model');
const passport = require('passport');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

module.exports = passport;