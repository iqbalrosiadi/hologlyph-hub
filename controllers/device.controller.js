var async = require('async');

var Data = require('../models/data.model.js');
var Channel = require('../models/channel.model.js');
var Sensor = require('../models/sensor.model.js');
var Device = require('../models/device.model.js');
var Glyph = require('../models/glyph.model.js');
var Marker = require('../models/marker.model.js');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res, next) {
    Device.find()
	.populate({
		path: 'sensor',
		populate: 'data'
	})
	.exec(function(err, list_devices){
		if (err) { return next(err); }
		res.render('visualized', { title: 'Registered Device', list_devices: JSON.stringify( list_devices, undefined, 4 )});
	});

};

// Display list of device
exports.device_list = function(req, res, next) {
	Device.find()
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
exports.device_delete_get = function(req, res, next) {
	 async.parallel({
        device: function(callback) {
            Device.findById(req.params.id)
            .populate('sensor')
            .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.device==null) { // No results.
            res.redirect('/detail/devices');
        }
        // Successful, so render.
        res.render('device_delete', { title: 'Delete Device', device: results.device } );
    });
};

// Display list of device
exports.device_delete_post = function(req, res, next) {
	async.parallel({
        device: function(callback) {
            Device.findById(req.params.id).exec(callback);
        },
        sensor: function(callback) {
        	Sensor.find({'device':req.params.id}).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }

        	  for (var i = 0; i < results.sensor.length; i++) {
				Data.deleteMany({"sensor": results.sensor[i]._id }, function deleteChannel(err) {
				                if (err) { return next(err); }
				    });
			  }

			  Sensor.deleteMany({"device": results.device._id }, function deleteChannel(err) {
				                if (err) { return next(err); }
				    });

			  Device.findByIdAndRemove(results.device._id, function deleteChannel(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                res.redirect('/detail/devices');
            });

    });
};

// Display list of device
exports.device_update_get = function(req, res, next) {
	
	async.parallel({
		glyphs: function(callback){
			Glyph.find(callback);
		},
		markers: function(callback){ 
			Marker.find(callback);
		},
		device: function(callback){ 
			Device.findById(req.params.id).populate('sensor', '_id').exec(callback);
		},
	},
		function(err, device) {
        if (err) { return next(err); }
        if (device==null) { // No results.
            var err = new Error('Device not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('device_form', { title: 'Update Device', 
        	device: device.device, glyph_list: device.glyphs, 
        	marker_list: device.markers, errors: err });
    });
};

// Display list of device
exports.device_update_post = [
   
    // Validate that the name field is not empty.
    body('device_name', 'Device name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('device_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    	
    	// Create a genre object with escaped and trimmed data (and the old id!)
        	var device = new Device(
	          { 
	          	_id: req.params.id,
	          	device_name: req.body.device_name, 
	          	glyph: req.body.glyph,
	          	marker: req.body.marker,
	          	as_one_glyph: req.body.one_glyph,
	          	sensor: JSON.parse(req.body.sensor)
	          }
	        );

        	console.log("SENSOR LIST " + JSON.parse(req.body.sensor));

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('device_form', { title: 'Update device', 
            	device: device.device, glyph_list: device.glyphs, 
        		marker_list: device.markers,  
            	errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Device.findByIdAndUpdate(req.params.id, device, {}, function (err,thechannel) {
                if (err) { return next(err); }
                   // Successful - redirect to channel detail page.
                   res.redirect(thechannel.url);
                });
        }
    }
];