var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VisualSchema = new Schema(
		{
			glyph: {type: String},
			marker: {type: String},
			as_one_glyph: {type: String}
		}
);


VisualSchema
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