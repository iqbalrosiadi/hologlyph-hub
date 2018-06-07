var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SensorSchema = new Schema(
		{
			device: {type: Schema.ObjectId, ref: 'Device', required: true },
			sensor_name: {type: String},
			channel: {type: String, default:'none'},//{type: Schema.ObjectId, ref: 'Channel', required: true },
			glyph: {type: String, default:'none'},//{type: Schema.ObjectId, ref: 'Glyph', required: true },
			max_val: {type: Number, default:100},
			min_val: {type: Number, default:0},
			max_color: {type: String, default:'#ff0000'},
			min_color: {type: String, default:'#008000'},
			def_color: {type: String, default:'#000000'},
			data_range_minute: {type: Number, default:60},
			set_size: {type: String, default:'0.5'},
			opacity: {type: String, min:'0%' , default:'100%'},
			calculation: {type: String, enum: ['average', 'summary', 'lastvalue'], default:'lastvalue'},
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