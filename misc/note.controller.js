var Maindata = require('../models/main.model.js');
var Sensordata = require('../models/sensor.model.js');
var mongoose = require('mongoose');


exports.initial_create = function(req, res) {
	var now = new Date();
	var id = req.body.id;
	var f1 = req.body.f1;

    var maindata = new Maindata({
                    _id: new mongoose.Types.ObjectId(),
                    sname: "sensor iqbal"
            });
	

	maindata.save(function(err,data){
		console.log(data);
		if(err){
			console.log(err);
            res.status(500).send({message: "Some error occurred while creating the Sensor."});
		} else {
            
            var sensordata = new Sensordata({
                    _id: new mongoose.Types.ObjectId(),
                    sid: maindata._id,
                    /* preserve for setting_id*/
                    fieldn: "field1",
                    name: "humidity",
                    data:[
                    {
                        date: now,
                        long: "blablabla",
                        lat: "bliblibli",
                        value: 49
                    },
                    {
                        date: now,
                        long: "blublublu",
                        lat: "bliblibli",
                        value: 494
                    }
                    ]
            });

            sensordata.save(function(err,sendata){
                console.log(sendata);
                if(err){
                    console.log(err);
                    res.status(500).send({message: "Some error occurred while creating the Sensor."});
                }
                //res.send(sendata);
            });


            var sensordata = new Sensordata({
                    _id: new mongoose.Types.ObjectId(),
                    sid: maindata._id,
                    /* preserve for setting_id*/
                    fieldn: "field2",
                    name: "temprature",
                    data:[
                    {
                        date: now,
                        long: "blablabla",
                        lat: "bliblibli",
                        value: 49
                    },
                    {
                        date: now,
                        long: "blublublu",
                        lat: "bliblibli",
                        value: 494
                    }
                    ]
            });

            sensordata.save(function(err,sendata){
                console.log(sendata);
                if(err){
                    console.log(err);
                    res.status(500).send({message: "Some error occurred while creating the Sensor."});
                }
                //res.send(sendata);
            });
           
			res.send(maindata+'</br>'+sensordata);
		}

	}); 

};


exports.create = function(req, res) {
    // Create and Save a new Sensor
    if(!req.body.content) {
        res.status(400).send({message: "Sensor can not be empty"});
    }
    var Sensor = new Sensor({title: req.body.title || "Untitled Sensor", content: req.body.content});

    Sensor.save(function(err, data) {
        console.log(data);
        if(err) {
            console.log(err);
            res.status(500).send({message: "Some error occurred while creating the Sensor."});
        } else {
            res.send(data);
        }
    });
};



exports.findAll = function(req, res) {
    // Retrieve and return all Sensors from the database.
    Sensordata.find(function(err, Sensors){
        if(err) {
            res.status(500).send({message: "Some error occurred while retrieving Sensors."});
        } else {
            res.send(Sensors);
        }
    });
};

exports.findOne = function(req, res) {
    // Find a single Sensor with a SensorId
    Sensordata.findById(req.params.sensorId, function(err, data) {
        if(err) {
            res.status(500).send({message: "Could not retrieve Sensor with id " + req.params.sensorId});
        } else {
            res.send(data);
        }
    });
};









exports.showOne = function(req, res) {
     // Update a Sensor identified by the SensorId in the request
    Sensordata.findOne({ 'sid':req.params.sensorId,'fieldn':req.params.fieldId}, function(err, Sensor) {
        if(err) {
            res.status(500).send({message: "Could not find a Sensor with id " + req.params.sensorId});
        }
        else {
            res.send(Sensor);
        }
    });
};



exports.append = function(req, res) {
    var now = new Date();
     // Update a Sensor identified by the SensorId in the request
      Sensordata.findOneAndUpdate(
            { 'sid':req.params.sensorId,'fieldn':req.params.fieldId},
            { "$push":
                {
                    "data": {
                            date: now,
                            "value":  Math.random()
                            }
                }
            },{upsert: true, 'new': true},
                function(err,numAffected) {
                   // something with the result in here
                    if(err) {
                        res.send(err);
                        //res.status(500).send({message: "Could not update Sensor with id " + req.params.sensorId});
                    } else {
                        res.send(numAffected);
                    }
                }

        ); 
};



exports.update = function(req, res) {
    // Update a Sensor identified by the SensorId in the request
    Sensor.findOne(req.params.sensorId, function(err, Sensor) {
        if(err) {
            res.status(500).send({message: "Could not find a Sensor with id " + req.params.sensorId});
        }

        Sensor.title = req.body.title;
        Sensor.content = req.body.content;

        Sensor.save(function(err, data){
            if(err) {
                res.status(500).send({message: "Could not update Sensor with id " + req.params.sensorId});
            } else {
                res.send(data);
            }
        });
    });
};




exports.delete = function(req, res) {
    // Delete a Sensor with the specified SensorId in the request
    Sensor.remove({_id: req.params.SensorId}, function(err, data) {
        if(err) {
            res.status(500).send({message: "Could not delete Sensor with id " + req.params.id});
        } else {
            res.send({message: "Sensor deleted successfully!"})
        }
    });
};
