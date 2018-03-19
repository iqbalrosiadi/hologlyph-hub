var async = require('async');

var Device = require('../models/device.model.js');
var Glyph = require('../models/glyph.model.js');
var Marker = require('../models/marker.model.js');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of device
exports.device_list = function(req, res, next) {
	Device.find()
	.populate('marker')
	.populate('glyph')
	.populate('sensor')
	.sort([['device_name', 'ascending']])
	.exec(function(err, list_devices){
		if (err) { return next(err); }
		res.render('device_list', { title: 'Registered Device', list_devices: list_devices});
	});


};


// Display list of device
exports.device_detail = function(req, res, next) {
	Device.findById(req.params.id)
	.populate('marker')
	.populate('glyph')
	.populate('sensor')
	.exec(function(err, device_detail){
		if (err) { return next(err); }
		res.render('device_detail', { title: 'Registered Device', device: device_detail});
	});
};


// Display list of device
exports.device_create_get = function(req, res, next) {
	//res.render('device_form', { title: 'Register a New Device' });

	async.parallel({
		glyphs: function(callback){
			Glyph.find(callback);
		},
		markers: function(callback){ 
			Marker.find(callback);
		},
	}, function(err, results){
		if (err) { return next(err); }
        res.render('device_form', { title: 'Register a New Device', 
        	glyph_list: results.glyphs, marker_list: results.markers, errors: err });

	});
	
};

// Display list of device
exports.device_create_post = [
	
	body('device_name', 'Device name must not be empty.').isLength({ min: 1 }).trim(),
	sanitizeBody('channel_name').trim().escape(),
	(req, res, next) => {

		const errors = validationResult(req);

		var device = new Device(
	          { 
	          	device_name: req.body.device_name, 
	          	glyph: req.body.glyph,
	          	marker: req.body.marker,
	          	as_one_glyph: req.body.one_glyph
	          }
	        );

		if (!errors.isEmpty()) {

			async.parallel({
					glyphs: function(callback){
						Glyph.find(callback);
					},
					markers: function(callback){ 
						Marker.find(callback);
					},
				}, function(err, results){
					if (err) { return next(err); }
			        res.render('device_form', { title: 'Register a New Device', 
			        	glyph_list: results.glyphs, marker_list: results.markers, errors: errors.array() });

				});
			return;

		}else
		{

			device.save(function (err){
				if(err) { return next(err);}

					res.redirect(device.url);

			});


		}



	}


];

// Display list of device
exports.device_delete_get = function(req, res) {
	res.send('NOT IMPLEMENTED: device_list');
};

// Display list of device
exports.device_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: device_list');
};

// Display list of device
exports.device_update_get = function(req, res) {
	res.send('NOT IMPLEMENTED: device_list');
};

// Display list of device
exports.device_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: device_list');
};