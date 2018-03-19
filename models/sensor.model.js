var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SensorSchema = new Schema(
		{
			//IdSensor: {type: Schema.ObjectId},
			device: {type: Schema.ObjectId, ref: 'Device', required: true },
			sensor_name: {type: String},
			channel: {type: Schema.ObjectId, ref: 'Channel', required: true },
			glyph: {type: Schema.ObjectId, ref: 'Glyph', required: true },
			max_val: {type: Number},
			min_val: {type: Number},
			default_act: {type: String},
			calculation: {type: String, enum: ['avg', 'sum', 'lst', 'cnt'], default:'lst'},
			data_range_minute: {type: Number, min:0 , default:60},
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
.virtual('data_populated', {
  ref: 'Data',
  localField: '_id',
  foreignField: 'sensor'
});

SensorSchema
.virtual('url')
.get(function () {
		return '/detail/sensor/' + this._id;
	}
	);

module.exports = mongoose.model('Sensor', SensorSchema);