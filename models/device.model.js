var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DeviceSchema = new Schema(
		{
		sensor: [{type: Schema.ObjectId, ref: 'Sensor'}],
		device_name: {type: String},
		glyph: {type: String},
		marker: {type: String},
		as_one_glyph: {type: String}
		}
	);


DeviceSchema
.virtual('url')
.get(function () {
		return '/detail/device/' + this._id;
	}
	);

module.exports = mongoose.model('Device', DeviceSchema);