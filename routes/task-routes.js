const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// import the model that will be used for the tasks collection
const Task = require("../models/task-model");
const User = require("../models/user-model");
// var bodyParser = require('body-parser')
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))

// GET route => get all the tasks in the collection
router.get("/tasks", (req, res, next) => {
  // console.log("what are you printing");
  // if(req.user) {

  //   console.log("user exist", req.user.email);
  // }
  // else {
  //   console.log("user doesn't exist")
  // }
  if (!req.user) {
    res.json({ no: "user" });
  } else {
    // if(req.user) {
    Task.find({ owner: req.user._id }).then(allProjects => {
      // console.log(req.user + "+++++++++++++++");
      // console.log(req.session);
      res.json(allProjects);
    });
  }
});

// GET route => to get all the projects
router.get("/projects", (req, res, next) => {
  Project.find()
    .populate("tasks")
    .then(allTheProjects => {
      res.json(allTheProjects);
    }) 
    .catch(err => {
      res.json(err);
    });
});

router.get("/task/edit/:id", (req, res, next) => {
  // console.log('leopard', req.user, req.params)
  filter = { owner: req.user._id, _id: req.params.id };
  // options = { runValidators: true, new: true, context: 'query' };
  Task.findOne(filter)
    .then(task => {
      res.json(task);
      // console.log(task);
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

router.delete("/task/delete/:id", (req, res, next) => {
  Task.findOneAndDelete({ _id: req.params.id })
    .then(task => {
      res.json(task);
    })
    .catch(err => {
      console.log(err);
    });
});



router.post("/task/edit/:id", (req, res, next) => {
  console.log(req.body);
  taskUpdate = {
    title: req.body.title,
    description: req.body.description,
    zone: req.body.zone,
    duration: req.body.duration,
    status: req.body.status
  };

  filter = { owner: req.user._id, _id: req.params.id };
  options = { runValidators: true, new: true, context: "query" };
  Task.findOneAndUpdate(filter, taskUpdate, options)
    .then(task => {
      res.json(task);
      console.log(task);
      console.log(req.body);
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// POST route => to create a new task
router.post("/tasks", (req, res, next) => {
  //  console.log("-=-=-=-=-=-=-=-=-=-=-=-=-",req.body, req.session, req.user)
  // console.log(req.user._id);
  // console.log(req.user);
  Task.create({
    title: req.body.title,
    description: req.body.description,
    zone: { name: "", address: "", lat: 0, lng: 0 },
    duration: 0,
    status: "active",
    owner: req.user._id,
    date: "",
  })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
