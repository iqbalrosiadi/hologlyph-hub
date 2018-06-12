var express = require('express');
var router = express.Router();

// Require controller modules.
var device_controller = require('../controllers/device.controller.js');
var sensor_controller = require('../controllers/sensor.controller.js');
var channel_controller = require('../controllers/channel.controller.js');
var marker_controller = require('../controllers/marker.controller.js');
var data_controller = require('../controllers/data.controller.js');
var glyph_controller = require('../controllers/glyph.controller.js');


/// DEVICE ROUTES ///

// GET catalog home page.
router.get('/', device_controller.index);

// GET request for creating a device. NOTE This must come before routes that display device (uses id).
router.get('/device/create', device_controller.device_create_get);

// POST request for creating device.
router.post('/device/create', device_controller.device_create_post);

// GET request to delete device.
router.get('/device/:id/delete', device_controller.device_delete_get);

// POST request to delete device.
router.post('/device/:id/delete', device_controller.device_delete_post);

// GET request to update device.
router.get('/device/:id/update', device_controller.device_update_get);

// POST request to update device.
router.post('/device/:id/update', device_controller.device_update_post);

// GET request for one device.
router.get('/device/:id', device_controller.device_detail);

// GET request for list of all device items.
router.get('/devices', device_controller.device_list);

/// SENSOR ROUTES ///

// GET request for creating a sensor. NOTE This must come before routes that display sensor (uses id).
router.get('/device/:id/addsensor', sensor_controller.sensor_create_get);

// GET request for creating a sensor. NOTE This must come before routes that display sensor (uses id).
router.get('/glyph/create', sensor_controller.new_glyph_create_get);

// GET request for creating a sensor. NOTE This must come before routes that display sensor (uses id).
router.get('/chart/create', sensor_controller.new_chart_create_get);

// GET request for creating a sensor. NOTE This must come before routes that display sensor (uses id).
router.get('/scatterplot/create', sensor_controller.new_scatter_create_get);

// POST request for creating a sensor. NOTE This must come before routes that display sensor (uses id).
router.post('/device/:id/addsensor', sensor_controller.sensor_create_post);

// GET request to delete sensor.
router.get('/sensor/:id/delete', sensor_controller.sensor_delete_get);

// POST request to delete sensor.
router.post('/sensor/:id/delete', sensor_controller.sensor_delete_post);

// GET request to update sensor.
router.get('/sensor/:id/update', sensor_controller.sensor_update_get);

// POST request to update sensor.
router.post('/sensor/:id/update', sensor_controller.sensor_update_post);

// GET request for one sensor.
router.get('/sensor/:id', sensor_controller.sensor_detail);

// GET request for one sensor.
router.get('/sensor/code/:id', sensor_controller.sensor_code);

// GET request for list of all sensor items.
router.get('/sensors', sensor_controller.sensor_list);

/// channel ROUTES ///

// GET request for creating a channel. NOTE This must come before routes that display channel (uses id).
router.get('/channel/create', channel_controller.channel_create_get);

// POST request for creating channel.
router.post('/channel/create', channel_controller.channel_create_post);

// GET request to delete channel.
router.get('/channel/:id/delete', channel_controller.channel_delete_get);

// POST request to delete channel.
router.post('/channel/:id/delete', channel_controller.channel_delete_post);

// GET request to update channel.
router.get('/channel/:id/update', channel_controller.channel_update_get);

// POST request to update channel.
router.post('/channel/:id/update', channel_controller.channel_update_post);

// GET request for one channel.
router.get('/channel/:id', channel_controller.channel_detail);

// GET request for list of all channel items.
router.get('/channels', channel_controller.channel_list);

/// marker ROUTES ///

// GET request for creating a marker. NOTE This must come before routes that display marker (uses id).
router.get('/marker/create', marker_controller.marker_create_get);

// POST request for creating marker.
router.post('/marker/create', marker_controller.marker_create_post);

// GET request to delete marker.
router.get('/marker/:id/delete', marker_controller.marker_delete_get);

// POST request to delete marker.
router.post('/marker/:id/delete', marker_controller.marker_delete_post);

// GET request to update marker.
router.get('/marker/:id/update', marker_controller.marker_update_get);

// POST request to update marker.
router.post('/marker/:id/update', marker_controller.marker_update_post);

// GET request for one marker.
router.get('/marker/:id', marker_controller.marker_detail);

// GET request for list of all marker items.
router.get('/markers', marker_controller.marker_list);

/// data ROUTES ///

// GET request for creating a data. NOTE This must come before routes that display data (uses id).
router.get('/data/create/:id/:val', data_controller.data_create_get);

// POST request for creating data.
router.post('/data/create/:id/:val', data_controller.data_create_post);

router.put('/data/create/:id/:val', data_controller.data_create_post);

// GET request to delete data.
router.get('/data/:id/delete', data_controller.data_delete_get);

// POST request to delete data.
router.post('/data/:id/delete', data_controller.data_delete_post);

// GET request to update data.
router.get('/data/:id/update', data_controller.data_update_get);

// POST request to update data.
router.post('/data/:id/update', data_controller.data_update_post);

// GET request for one data.
router.get('/data/:id', data_controller.data_detail);

// GET request for list of all data items.
router.get('/datas', data_controller.data_list);

/// glyph ROUTES ///

// GET request for creating a glyph. NOTE This must come before routes that display glyph (uses id).
router.get('/glyph/create', glyph_controller.glyph_create_get);

// POST request for creating glyph.
router.post('/glyph/create', glyph_controller.glyph_create_post);

// GET request to delete glyph.
router.get('/glyph/:id/delete', glyph_controller.glyph_delete_get);

// POST request to delete glyph.
router.post('/glyph/:id/delete', glyph_controller.glyph_delete_post);

// GET request to update glyph.
router.get('/glyph/:id/update', glyph_controller.glyph_update_get);

// POST request to update glyph.
router.post('/glyph/:id/update', glyph_controller.glyph_update_post);

// GET request for one glyph.
router.get('/glyph/:id', glyph_controller.glyph_detail);

// GET request for list of all glyph items.
router.get('/glyphs', glyph_controller.glyph_list);

module.exports = router;




