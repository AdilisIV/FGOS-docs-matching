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

var converController = require('../express-app/controllers/DocConverterController');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use('/', indexRouter);

// server.js
const port = 8082;
app.listen(port, () => {
  console.log('We are live on ' + port);
});



// function runScript() {
//     let pathToDoc = "/Users/mac/Documents/fgos-matching/docs/word/doc/RPM_RPD_IST_Explutats_2_sm_1.doc"

//     converController.convert(pathToDoc, function(err, data) {
//         console.log(data)
//     })
// }

// runScript()