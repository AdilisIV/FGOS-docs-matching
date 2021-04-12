"use strict";

/**
 * Module dependencies.
 */

var http = require('http')
  , path = require('path')
  , express = require('express')
  , app = express()
;
const bodyParser     = require('body-parser');
var indexRouter = require('./routes/routes');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use('/', indexRouter);

// server.js
const port = 7376;
app.listen(port, () => {
  console.log('We are live on ' + port);
});
