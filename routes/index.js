var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res) {
  //res.redirect('/');
  res.render('sensor_list', { title: 'Hologyph Hub' });
});

module.exports = router;