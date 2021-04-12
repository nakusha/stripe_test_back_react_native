'use strict';
const express = require("express");
var logger = require('morgan');
var cors = require('cors');
var http = require('http');

// Router
var payment = require('./routes/payment')
var billing = require('./routes/billing')

const app = express();
// This is your real test secret API key.

app.use(logger('dev'));
app.use(express.static("."));
app.use(express.json());

var whitelist = [
  'http://localhost:3000', 
  'http://localhost:80', 
  'http://localhost:4242', 
]
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true,credentials: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));

app.use('/billing', billing);
app.use('/payment', payment);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
});


var httpServer = http.createServer(app).listen(4242, function () {
  console.log('Express http server listening on port ' + httpServer.address().port);
});