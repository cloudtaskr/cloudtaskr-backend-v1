const express = require("express");
const router = express.Router();
const User = require("../models/user-model");
const passport = require("../config/passport");

// signup POST
router.post("/signup", (req, res, err) => {
  let password = req.body.password;
  let incomingUserObj = {
    email: req.body.email,
    username: req.body.username,
    zones: {
      home: { name: "home", address: "", lat: "0", lng: "0" },
      work: { name: "work", address: "", lat: "0", lng: "0" }
    }
  };

  User.register(incomingUserObj, password)
    .then(user => {
      req.login(user, function(err, result) {
        res.json(user);
      });
      res.json(user);
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

router.post("/editprofile/name", (req, res, err) => {
  let update = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };
  filter = { _id: req.user._id };

  options = { new: true, upsert: true };
  User.findOneAndUpdate(filter, update, options)
    .then(user => {
      res.json(user);
      // console.log(user);
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

router.post("/editprofile/username", (req, res, err) => {
  // meow meow meow meow meow - Jess
  let update = {
    username: req.body.username,
    unique: true
  };
  filter = { _id: req.user._id };
  options = { runValidators: true, new: true, context: "query" };
  User.findOneAndUpdate(filter, update, options)
    .then(user => {
      res.json(user);
      // console.log(user);
    })
    .catch(err => {
      // res.status(500).json({ err });
      res.json({ err });
    });
});

router.post("/editprofile/zones", (req, res, next) => {
  console.log(req.body);
  let zoneUpdate = req.body;
  //       {name: "home",
  //     address:"address",
  //   lat:"lat",
  // lng:"lng"}

  filter = { _id: req.user._id };
  options = { runValidators: true, new: true, context: "query", upsert: true };
  User.findOneAndUpdate(filter, zoneUpdate, options)
    .then(user => {
      res.json(user);
      // console.log(user);
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// check if user is logged in,
router.get("/isLoggedIn", (req, res, next) => {
  // console.log("checking logged in");
  // console.log("this is user", req.user);
  res.json(req.user);
});

// logout GET
router.get("/logout", (req, res, next) => {
  req.logout();
  // res.status(200).json({ message: 'Log out success!' });
  res.json({ message: "Log out success!" });
});

// login POST
router.post("/login", passport.authenticate("local"), (req, res, next) => {
  // console.log("login whats inside req", req);
  // console.log("login whats inside req.user", req.user);
  req.session.word = "yes";
  res.json(req.user);
});

// not used yet
router.get("/loggedin", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

module.exports = router;
