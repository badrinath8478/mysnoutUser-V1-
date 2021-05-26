require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);


const tenantRouter = require("./router/auth");
const getroutesRouter = require("./router/getroutes");
const tenant = require('./model/tenant');


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('DB Connected!');
 }).catch(err => { console.log(err) });
mongoose.Promise = global.Promise;


const store = new MongoDBSession({
  uri: process.env.MONGO_URL,
  collection: "mySessions"
});


app.use(session({
    secret: 'Dontsayit',
  resave: true,
  saveUninitialized: true,
  store: store

}));

app.use(function(req, res, next) {
  if (req.session && req.session.tenant) {
    tenant.findOne({ email: req.session.tenant.email }, function(err, tenant) {
      if (tenant) {
        req.tenant = tenant;
        delete req.tenant.password; // delete the password from the session
        req.session.tenant = tenant;  //refresh the session value
        res.locals.tenant = tenant;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});


app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use( express.static(path.join(__dirname, "public")));



app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});



app.use("/tenant", tenantRouter);
app.use("/tenant", getroutesRouter);


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});


app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


module.exports = app;




