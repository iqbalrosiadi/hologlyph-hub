var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res) {
  //res.redirect('/');
  //res.render('style_guide', { title: 'Express' });
	var ob = { action:"date +%s", result:"1367263074"};
	res.render('style_guide', { layout : 'layout', json: JSON.stringify(ob) });

});

module.exports = router;