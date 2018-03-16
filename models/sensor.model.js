var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SensorSchema = new Schema(
		{
			//IdSensor: {type: Schema.ObjectId},
			device: {type: Schema.ObjectId, ref: 'Device', required: true },
			sensor_name: {type: String},
			channel: {type: Schema.ObjectId, ref: 'Channel', required: true },
			glyph: {type: Schema.ObjectId, ref: 'Glyph', required: true },
			max_val: {type: String},
			min_val: {type: String},
			max_act: {type: String},
			min_act: {type: String},
			default_act: {type: String},
			data: [{type: Schema.ObjectId, ref: 'Data'}]
		}
);


SensorSchema
.virtual('name')
.get(function () {
		return this.sensor_name;
	}
	);

SensorSchema
.virtual('Id_Sensor')
.get(function () {
		return this.IdSensor;
	}
	);

SensorSchema
.virtual('url')
.get(function () {
		return '/detail/sensor/' + this._id;
	}
	);

module.exports = mongoose.model('Sensor', SensorSchema);