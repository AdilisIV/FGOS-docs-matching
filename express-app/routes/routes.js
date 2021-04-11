var express = require('express');
var router = express.Router();
var controller = require('../controllers/VerifyController')


router.get('/verify', controller.verify)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('doc has some several errors.......');
});

module.exports = router;