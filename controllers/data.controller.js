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

		console.log("name of the channel before " + data.value);

		if (!errors.isEmpty()) {
			res.send('Data is not complete');
			return;

		}else
		{
			


					Sensor.findOneAndUpdate(
					{"_id": req.params.id}, {$push: {"data": data._id}} ,
					function(errs,sensor_detail)
					{
						if(errs) { return next(errz);}

						sensor_detail.save(function (err){
								if(err) { return next(err);}
								var start = new Date(new Date().getTime() - (1 * 60 * 1000));
								Data.find({ "date": { "$lte": start } }).select("date _id").exec(function(err,data_details){
									console.log('paling lama :'+ data_details);
										Data.deleteMany({"_id": { $in: data_details }}, function(errors, data_deleted){
											console.log('deleting sensor blbla'+ data_details);
											Sensor.findByIdAndUpdate(sensor_detail._id, { $pull: { data: { $in: data_details }}}, function (err) {
									        //console.log('deleting sensor data');
									            if (errors) { return next(errors);}
									            			data.save(function (err){
																if(err) { return next(err);}
																res.send('Data is saved iniih'+ data);
															});
									            
									        });

										});

									      
									
								});
									

							});
					});




		}



	}



];

// Display list of device
exports.data_create_post = [
	

	(req, res, next) => {

		const errors = validationResult(req);

		var data = new Data(
	          { 
	          	sensor: req.params.id,
	          	value: req.params.val
	          }
	        );

		if (!errors.isEmpty()) {
			res.send('Data is not complete');
			return;

		}else
		{

			data.save(function (err){
				if(err) { return next(err);}
					Sensor.findOneAndUpdate(
					{"_id": req.params.id}, {$push: {"data": data._id}} ,
					function(errs,results)
					{
						if(errs) { return next(errz);}
						results.save(function (err){
								if(err) { return next(err);}
									res.send('Data is saved blabla'+results.data_range_minute);

							});
					});

			});


		}



	}



];
// Display list of device
exports.data_delete_get = function(req, res) {
	res.send('NOT IMPLEMENTED: data_list');
};

// Display list of device
exports.data_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: data_list');
};

// Display list of device
exports.data_update_get = function(req, res) {
	res.send('NOT IMPLEMENTED: data_list');
};

// Display list of device
exports.data_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: data_list');
};