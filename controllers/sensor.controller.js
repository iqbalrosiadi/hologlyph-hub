var async = require('async');

var Sensor = require('../models/sensor.model.js');
var Device = require('../models/device.model.js');
var Glyph = require('../models/glyph.model.js');
var Channel = require('../models/channel.model.js');
var Marker = require('../models/marker.model.js');
var Data = require('../models/data.model.js');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var sensor_type_list='[';
sensor_type_list=sensor_type_list+'{"sensor_type":"Temperature"},';
sensor_type_list=sensor_type_list+'{"sensor_type":"Humidity"},';
sensor_type_list=sensor_type_list+'{"sensor_type":"Sound"},';
sensor_type_list=sensor_type_list+'{"sensor_type":"Light Intensity"}';
sensor_type_list=sensor_type_list+']';
var sens_type = JSON.parse(sensor_type_list);




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
exports.sensor_code = function(req, res, next) {
	async.parallel({
		sensor_detail: function(callback){
			Sensor.findById(req.params.id).populate('device').exec(callback);
		}
	}, function(err, sensors){
		if (err) { return next(err); }
		res.render('sensor_code', { title: 'Embedded Code for Arduino', sensor: sensors.sensor_detail});
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
		console.log(sens_type);
		res.render('sensor_form', { title: 'Create a New Sensor', sensor_type: sens_type} );
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
	          	sensor_type: req.body.type,
	          	data_range_minute: req.body.range
	          }
	        );
		console.log("SENSOR LIST " + req.body.range);
		
		if (!errors.isEmpty()) {

			console.log(sens_type);
			res.render('sensor_form', { title: 'Create a New Sensor', sensor_type: sens_type} );

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
            res.redirect('/');
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
                res.redirect('/');
            });

    });
};

// Display list of device
exports.sensor_update_get = function(req, res, next) {
	
	async.parallel({
		sensor: function(callback){ 
			Sensor.findById(req.params.id)
			.exec(callback);
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


        //console.log(" SENSOR DATA "+sensor.sensor.data.length);
        //console.log(" SENSOR DATA "+sensor.sensor);
        res.render('sensor_form', { title: 'Edit Sensor Data', 
        	sensor: sensor.sensor, sensor_type: sens_type, errors: err });
    });
};

// Display list of device
exports.sensor_update_post = [
   
    // Validate that the name field is not empty.
    //body('sensor_name', 'Sensor name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    //sanitizeBody('sensor_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);
        var opacity = "100%";
        var set_size = "0.5";
    // Create a genre object with escaped and trimmed data (and the old id!)
    	if (req.body.amount)
    	{	
    		opacity = req.body.amount;
    	}

    	if (req.body.amountsize)
    	{	
    		set_size = req.body.amountsize;
    	}
    	
        	var sensor = new Sensor(
	          { 
	          	_id: req.params.id,
	          	sensor_name: req.body.sensor_name,
	          	sensor_type: req.body.type,
	          	data_range_minute: req.body.range
	          }
	        );

        	console.log("COnsole " + req.body.sensor_name);
	        //console.log("AMOUNTSIZE " + req.body.amountsize);
	        //console.log("DEFAULT COLOR " + req.body.default_color);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.

        	async.parallel({
		sensor: function(callback){ 
			Sensor.findById(req.params.id)
			.exec(callback);
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


        //console.log(" SENSOR DATA "+sensor.sensor.data.length);
        console.log(" SENSOR DATA "+sensor.sensor);
        res.render('sensor_form', { title: 'Edit Sensor Data', 
        	sensor: sensor.sensor, sensor_type: sens_type, errors: err });
    		});


        }
        else {
        		console.log("SENSOR TYPEE"+sensor.sensor_name);
                Sensor.findByIdAndUpdate(req.params.id, sensor, {}, function (err,thechannel) {
                if (err) { return next(err); }
                   // Successful - redirect to channel detail page.
                   res.redirect('/');
                });
        }
    }
];