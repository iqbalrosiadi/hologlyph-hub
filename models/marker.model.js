var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MarkerSchema = new Schema(
		{
		marker_name: {type: String}
		}
	);


MarkerSchema
.virtual('url')
.get(function () {
		return '/detail/marker/' + this._id;
	}
	);

module.exports = mongoose.model('Marker', MarkerSchema);