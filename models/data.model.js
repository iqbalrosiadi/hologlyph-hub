var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

var Schema = mongoose.Schema;

var DataSchema = new Schema(
		{
			sensor: {type: Schema.ObjectId, ref: 'Sensor', required: true },
			date: {type: Date, default: Date.now},
			value: {type: Number}
		}
);



DataSchema
.virtual('url')
.get(function () {
		return '/detail/data/' + this._id;
	}
	);

module.exports = mongoose.model('Data', DataSchema);