var async = require('async');

var Sensor = require('../models/sensor.model.js');
var Device = require('../models/device.model.js');
var Glyph = require('../models/glyph.model.js');
var Channel = require('../models/channel.model.js');
var Marker = require('../models/marker.model.js');
var Data = require('../models/data.model.js');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');



// Display list of device
exports.sensor_list = function(req, res) {
	res.send('NOT IMPLEMENTED: sensor_list');
};

// Display list of device
exports.sensor_detail = function(req, res, next) {
	async.parallel({
		sensor_detail: function(callback){
			Sensor.findById(req.params.id).populate('device').exec(callback);
		},
		datas: function(callback){ 
			Data.find(req.params.id, 'date value -_id').sort([['date','descending']]).exec(callback);
		},
	}, function(err, sensors){
		if (err) { return next(err); }
		res.render('sensor_detail', { title: 'Registered Device', sensor: sensors.sensor_detail, data: sensors.datas});
	});
};

// Display list of device
exports.sensor_create_get = function(req, res, next) {
		async.parallel({
		channels: function(callback){
			Channel.find(callback);
		},
		glyphs: function(callback){ 
			Glyph.find(callback);
		},
	}, function(err, results){
		if (err) { return next(err); }
        res.render('sensor_form', { title: 'Add a New Sensor', 
        	channel_list: results.channels, mark_list: results.glyphs, errors: err });

	});
};

// Display list of device
exports.sensor_create_post = [
	
	body('sensor_name', 'Sensor name must not be empty.').isLength({ min: 1 }).trim(),
	sanitizeBody('sensor_name').trim().escape(),
	(req, res, next) => {

		const errors = validationResult(req);

		var sensor = new Sensor(
	          { 
	          	device: req.params.id,
	          	sensor_name: req.body.sensor_name, 
	          	glyph: req.body.glyph,
	          	channel: req.body.channel,
	          	max_val: req.body.max_val,
	          	min_val: req.body.min_val,
	          	calculation: req.body.calculation,
	          	data_range_minute: req.body.range
	          }
	        );

		if (!errors.isEmpty()) {

				async.parallel({
					channels: function(callback){
						Channel.find(callback);
					},
					glyphs: function(callback){ 
						Glyph.find(callback);
					},
				}, function(err, results){
					if (err) { return next(err); }
			        res.render('sensor_form', { title: 'Add a New Sensor', 
			        	channel_list: results.channels, mark_list: results.glyphs, errors: err });

				});
			return;

		}else
		{

			sensor.save(function (err){
				if(err) { return next(err);}
					Device.findOneAndUpdate(
					{"_id": req.params.id}, {$push: {"sensor": sensor._id}} ,
					function(errs,results)
					{
						if(errs) { return next(errz);}
						results.save(function (err){
								if(err) { return next(err);}
									res.redirect(results.url);

							});
					});

			});


		}



	}





];

// Display list of device
exports.sensor_delete_get = function(req, res) {
	res.send('NOT IMPLEMENTED: sensor_list');
};

// Display list of device
exports.sensor_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: sensor_list');
};

// Display list of device
exports.sensor_update_get = function(req, res) {
	res.send('NOT IMPLEMENTED: sensor_list');
};

// Display list of device
exports.sensor_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: sensor_list');
};