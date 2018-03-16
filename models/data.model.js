var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DataSchema = new Schema(
		{
			sensor: {type: Schema.ObjectId, ref: 'Sensor', required: true },
			date: {type: Date, default: Date.now},
			value: {type: String}
		}
);


DataSchema
.virtual('url')
.get(function () {
		return '/detail/data/' + this._id;
	}
	);

module.exports = mongoose.model('Data', DataSchema);