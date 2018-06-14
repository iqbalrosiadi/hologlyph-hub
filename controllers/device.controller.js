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
	.select('device_name _id')
	.populate({
		path: 'sensor',
		populate: { 
			path: 'data',
			select: '_id value date'

		},
		select: 'sensor_name _id'
	})
	.exec(function(err, list_devices){
		if (err) { return next(err); }

		
		var obj = "[" ;
		//obj.device = [];
		var i;
		
		for(i=0; i<list_devices.length; i++)
		{
			obj=obj+"{";

			var j;
			obj=obj+'"sensor":[';
			for(j=0; j<list_devices[i].sensor.length; j++)
			{
				var k;
				console.log(list_devices[i].sensor[j].sensor_name);
				obj=obj+"{";
				obj=obj+'"sensor_name":"'+list_devices[i].sensor[j].sensor_name+'",';
				obj=obj+'"sensor_type":"'+list_devices[i].sensor[j].sensor_type+'",';
				obj=obj+'"_id":"'+list_devices[i].sensor[j]._id+'",';
				obj=obj+'"data":[';
				for(k=0; k<list_devices[i].sensor[j].data.length; k++)
				{
					obj=obj+list_devices[i].sensor[j].data[k].value;
					if(k!=(list_devices[i].sensor[j].data.length-1)){obj=obj+",";}
				}
				obj=obj+"]";
				//console.log(list_devices[i].sensor[j].data.length);
				if(list_devices[i].sensor[j].data.length!=0)
				{
					//let date = new Date(list_devices[i].sensor[j].data[k-1].value);
					obj=obj+',"last_input_date":"'+list_devices[i].sensor[j].data[k-1].date+'"';
				}
				//obj=obj+',"datee":"'+list_devices[i].sensor[j].data[k].value+'"';
				obj=obj+"}";
				if(j!=(list_devices[i].sensor.length-1)){obj=obj+",";}
			} 
			obj=obj+'],';
			//console.log(list_devices[i].sensor[0].dataset);
			obj=obj+'"_id":"'+list_devices[i]._id+'",';
			obj=obj+'"device_name":"'+list_devices[i].device_name+'"';
			obj=obj+"}";
			if(i!=(list_devices.length-1)){obj=obj+",";}

		}
		//console.log(list_devices[0].sensor[1].dataset);
		obj= obj+"]";
		var dataset = JSON.parse(obj);
		console.log(obj);
		//JSON.stringify( blabla, undefined, 4 )
		res.render('visualized', { title: 'Registered Device', list_devices: dataset});
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
	res.render('device_form', { title: 'Register a New Microcontroller' });
	
};

// Display list of device
exports.device_create_post = [
	
	body('device_name', 'Device name must not be empty.').isLength({ min: 1 }).trim(),
	sanitizeBody('channel_name').trim().escape(),
	(req, res, next) => {

		const errors = validationResult(req);

		var device = new Device(
	          { 
	          	device_name: req.body.device_name
	          }
	        );

		if (!errors.isEmpty()) {

			res.render('device_form', { title: 'Register a New Microcontroller' });

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
            res.redirect('/');
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
                res.redirect('/');
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