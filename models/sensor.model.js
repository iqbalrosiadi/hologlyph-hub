var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SensorSchema = new Schema(
		{
			sensor_name: {type: String},
			sensor_type: {type: String},
			device: {type: Schema.ObjectId, ref: 'Device', required: true },
			data_range_minute: {type: Number, default:1080},
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
  foreignField: 'sensor',
  justOne: false
});

SensorSchema
.virtual('url')
.get(function () {
		return '/detail/sensor/' + this._id;
	}
	);

module.exports = mongoose.model('Sensor', SensorSchema);