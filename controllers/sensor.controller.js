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
exports.sensor_list = function(req, res, next) {
	async.parallel({
		sensor_detail: function(callback){
			Sensor.find().populate('device').exec(callback);
		}
	}, function(err, sensors){
		if (err) { return next(err); }
		res.render('sensor_list', { title: 'Registered Sensor', sensor: sensors.sensor_detail});
	});
};

// Display list of device
exports.sensor_detail = function(req, res, next) {
	async.parallel({
		sensor_detail: function(callback){
			Sensor.findById(req.params.id).populate('device').exec(callback);
		},
		datas: function(callback){ 
			Data.find({'sensor':req.params.id}, 'date value -_id').sort([['date','descending']]).limit(7).exec(callback);
		},
	}, function(err, sensors){
		if (err) { return next(err); }
		res.render('sensor_detail', { title: 'Registered Sensor', sensor: sensors.sensor_detail, data: sensors.datas});
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
	          	data_range_minute: req.body.range,
	          	max_color: req.body.max_col_val,
	          	min_color: req.body.min_col_val
	          }
	        );
		console.log("SENSOR LIST " + req.body.range);
		
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
exports.sensor_delete_get = function(req, res, next) {
		async.parallel({
        sensor: function(callback) {
            Sensor.findById(req.params.id)
            .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.sensor==null) { // No results.
            res.redirect('/detail/devices');
        }
        // Successful, so render.
        res.render('sensor_delete', { title: 'Delete sensor', sensor: results.sensor } );
    });
};

// Display list of device
exports.sensor_delete_post = function(req, res, next) {
		async.parallel({
        sensor: function(callback) {
            Sensor.findById(req.params.id).exec(callback);
        },
        data: function(callback) {
        	Data.find({'sensor':req.params.id}).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }

			  Data.deleteMany({"sensor": results.sensor._id }, function deleteChannel(err) {
				                if (err) { return next(err); }
				    });

			  Sensor.findByIdAndRemove(results.sensor._id, function deleteChannel(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                res.redirect('/detail/device/'+results.sensor.device);
            });

    });
};

// Display list of device
exports.sensor_update_get = function(req, res, next) {
	
	async.parallel({
		glyphs: function(callback){
			Glyph.find(callback);
		},
		channel: function(callback){ 
			Channel.find(callback);
		},
		sensor: function(callback){ 
			Sensor.findById(req.params.id).exec(callback);
		},
	},
		function(err, sensor) {
        if (err) { return next(err); }
        if (sensor==null) { // No results.
            var err = new Error('Sensor not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        console.log(" SENSOR DATA "+sensor.sensor.data);
        res.render('sensor_form', { title: 'Update Sensor', 
        	sensor: sensor.sensor, mark_list: sensor.glyphs, 
        	channel_list: sensor.channel, errors: err });
    });
};

// Display list of device
exports.sensor_update_post = [
   
    // Validate that the name field is not empty.
    body('sensor_name', 'Sensor name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('sensor_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
        	var sensor = new Sensor(
	          { 
	          	_id: req.params.id,
	          	sensor_name: req.body.sensor_name, 
	          	glyph: req.body.glyph,
	          	channel: req.body.channel,
	          	max_val: req.body.max_val,
	          	min_val: req.body.min_val,
	          	calculation: req.body.calculation,
	          	data_range_minute: req.body.range,
	          	max_color: req.body.max_col_val,
	          	min_color: req.body.min_col_val,
	          	data: req.body.data
	          }
	        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
        	res.render('sensor_form', { title: 'Update Sensor', 
        	sensor: sensor.sensor, mark_list: sensor.glyphs, 
        	channel_list: sensor.channel, errors: err });
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Sensor.findByIdAndUpdate(req.params.id, sensor, {}, function (err,thechannel) {
                if (err) { return next(err); }
                   // Successful - redirect to channel detail page.
                   res.redirect(thechannel.url);
                });
        }
    }
];