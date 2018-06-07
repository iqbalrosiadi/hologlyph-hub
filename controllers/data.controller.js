var async = require('async');

var Sensor = require('../models/sensor.model.js');
var Data = require('../models/data.model.js');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');



// Display list of device
exports.data_list = function(req, res) {
	res.send('NOT IMPLEMENTED: data_list');
};


// Display list of device
exports.data_detail = function(req, res) {
	res.send('NOT IMPLEMENTED: data_list');
};


// Display list of device
exports.data_create_get = [
	
	//body('sensor_name', 'Sensor name must not be empty.').isLength({ min: 1 }).trim(),
	//sanitizeBody('sensor_name').trim().escape(),
	(req, res, next) => {

		const errors = validationResult(req);

		var data = new Data(
	          { 
	          	sensor: req.params.id,
	          	value: req.params.val
	          }
	        );

		console.log("name of the channel before " + data._id);

		if (!errors.isEmpty()) {
			res.send('Data is not complete');
			return;

		}else
		{
			
					Sensor.findOne(
					{"_id": req.params.id}, 
					function(errs,sensor_detail)
					{				
						if(sensor_detail)
						{
							if(errs) { return next(errs);}
								var start = new Date(new Date().getTime() - (sensor_detail.data_range_minute * 60 * 1000));
								//console.log('DATA');
								Data.find({ "date": { "$lte": start } }).select("date _id").exec(function(err,data_details){
									if(err) { return next(err);}
									console.log('paling lama :'+ data_details);
										Data.deleteMany({"_id": { $in: data_details }}, function(errors){
											console.log('deleting sensor paling lama :'+ data_details);
											if(errors) { return next(errors);}
											data.save(function (err){
												if(err) { return next(err);}
												//console.log('blaabla');
														Sensor.findByIdAndUpdate(sensor_detail._id, {$push: {"data": data._id}}  , function (err, hasil) {
												            if (errors) { return next(errors);}
															res.send('Data is saved ini ');
												            
												        });
												});
										});    
								});
						}else
						{
							res.send('Sensor is not found');
							return;
						}

					});




		}



	}



];

// Display list of device
exports.data_create_post = [
	
	//body('sensor_name', 'Sensor name must not be empty.').isLength({ min: 1 }).trim(),
	//sanitizeBody('sensor_name').trim().escape(),
	(req, res, next) => {

		const errors = validationResult(req);

		var data = new Data(
	          { 
	          	sensor: req.params.id,
	          	value: req.params.val
	          }
	        );

		console.log("name of the channel befores " + data._id);

		if (!errors.isEmpty()) {
			res.send('Data is not complete');
			return;

		}else
		{
			
					Sensor.findOne(
					{"_id": req.params.id}, 
					function(errs,sensor_detail)
					{				
						if(sensor_detail)
						{
							if(errs) { return next(errs);}
								var start = new Date(new Date().getTime() - (sensor_detail.data_range_minute * 60 * 1000));
								//console.log('DATA');
								Data.find({ "date": { "$lte": start } }).select("date _id").exec(function(err,data_details){
									if(err) { return next(err);}
									console.log('paling lama :'+ data_details);
										Data.deleteMany({"_id": { $in: data_details }}, function(errors){
											console.log('deleting sensor paling lama :'+ data_details);
											if(errors) { return next(errors);}
											data.save(function (err){
												if(err) { return next(err);}
												console.log('blaabla');
														Sensor.findByIdAndUpdate(sensor_detail._id, {$push: {"data": data._id}} , function (err, hasil) {
												            if (errors) { return next(errors);}
															res.send('Data is saved ini '+ result[0].average);
												            
												        });
												});
										});    
								});
						}else
						{
							res.send('Sensor is not found');
							return;
						}

					});




		}



	}



];
// Display list of device
exports.data_delete_get = function(req, res, next) {
		async.parallel({
        sensor: function(callback) {
            Sensor.findById(req.params.id)
            .exec(callback);
        },
        data: function(callback) {
        Data.find({'sensor':req.params.id})
        .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.sensor==null) { // No results.
            res.redirect('/detail/devices');
        }
        // Successful, so render.
        res.render('data_delete', { title: 'Delete whole data from the sensor', sensor: results.sensor, data: results } );
    });
};

// Display list of device
exports.data_delete_post = function(req, res, next) {
	console.log('sensor id '+ req.params.id);
	Data.find({"sensor": req.params.id }).select("_id").exec(function(err,data_details){
			if(err) { return next(err);}
			Data.deleteMany({"_id": { $in: data_details }}, function deleteChannel(err) {
	                if (err) { return next(err); }
	                res.redirect('/detail/sensor/'+req.params.id);
	    });

	});


};

// Display list of device
exports.data_update_get = function(req, res) {
	res.send('NOT IMPLEMENTED: data_list');
};

// Display list of device
exports.data_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: data_list');
};