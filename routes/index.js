var express = require('express');
var router = express.Router();

var sensor_controller = require('../controllers/sensor.controller.js');

// GET home page.
/*
router.get('/', function(req, res) {
  //res.redirect('/');
  res.render('sensor_list', { title: 'Hologyph Hub' });
}); */

// GET request for list of all device items.
router.get('/', sensor_controller.sensor_list);

module.exports = router;