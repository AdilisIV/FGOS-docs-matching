var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('/////')
  res.render('index', { title: 'NO Express' });
});

router.get('/root', function(req, res, next) {
  console.log('/////root')
  res.render('index', { title: 'ROOT' });
});

module.exports = router;