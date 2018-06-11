var express = require('express');
var router = express.Router();

var device_controller = require('../controllers/device.controller.js');

// GET home page.
/*
router.get('/', function(req, res) {
  //res.redirect('/');
  res.render('sensor_list', { title: 'Hologyph Hub' });
}); */

// GET request for list of all device items.
router.get('/', device_controller.index);

module.exports = router;