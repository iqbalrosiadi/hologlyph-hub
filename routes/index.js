var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res) {
  //res.redirect('/');
  res.render('index', { title: 'Hologyph Hub' });
});

module.exports = router;