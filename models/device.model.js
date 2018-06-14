var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DeviceSchema = new Schema(
		{
		sensor: [{type: Schema.ObjectId, ref: 'Sensor'}],
		device_name: {type: String}
		}
	);


DeviceSchema
.virtual('url')
.get(function () {
		return '/';
	}
	);

module.exports = mongoose.model('Device', DeviceSchema);