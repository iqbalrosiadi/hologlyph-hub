var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res) {
  //res.redirect('/');
  //res.render('style_guide', { title: 'Express' });
	//var ob = { action:"date +%s", result:"1367263074"};
	//res.render('backup_style', { title : 'layout' });
	//res.render('backup_style', { title : 'layout'});
	res.sendFile(__dirname + '/sample2.json');
});

/*
app.get('/datatmp', function(req, res,next) {  
    res.sendFile(__dirname + '/sample.json');
}); */

module.exports = router;