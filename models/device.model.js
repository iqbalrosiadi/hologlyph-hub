var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DeviceSchema = new Schema(
		{


		//IdDevice: {type: Schema.ObjectId},
		sensor: [{type: Schema.ObjectId, ref: 'Sensor'}],
		device_name: {type: String},
		glyph: {type: Schema.ObjectId, ref: 'Glyph'},
		marker: {type: Schema.ObjectId, ref: 'Marker'},
		as_one_glyph: {type: String}

		}
	);


DeviceSchema
.virtual('name')
.get(function () {
		return this.dev_name;
	}
	);

DeviceSchema
.virtual('url')
.get(function () {
		return '/detail/device/' + this._id;
	}
	);

module.exports = mongoose.model('Device', DeviceSchema);