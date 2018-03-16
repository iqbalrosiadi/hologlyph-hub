var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChannelSchema = new Schema(
		{
		channel_name: {type: String}
		}
	);


ChannelSchema
.virtual('url')
.get(function () {
		return '/detail/channel/' + this._id;
	}
	);

module.exports = mongoose.model('Channel', ChannelSchema);