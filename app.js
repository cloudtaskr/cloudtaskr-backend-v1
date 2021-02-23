require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
    j;
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

let whitelist = ["http://localhost:3000", "https://cloudtaskr.herokuapp.com"];
let corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// test this cors configuration to see if login bug is fixed in deployment
app.use(cors(corsOptions));

// app.use(
//   cors({
//     credentials: true,
//     origin: function (origin, callback) {
//       return callback(null, true);
//     },
//   })
// );

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// what is this?
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api", require("./routes/task-routes"));
app.use("/api", require("./routes/auth-routes"));

// app.get('*', (req,res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'))
// })

module.exports = app;
