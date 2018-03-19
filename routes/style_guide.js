var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res) {
  //res.redirect('/');
  //res.render('style_guide', { title: 'Express' });
	//var ob = { action:"date +%s", result:"1367263074"};
	//res.render('backup_style', { title : 'layout' });
	res.render('sensor_form', { title : 'layout'});
});

module.exports = router;