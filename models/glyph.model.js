var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GlyphSchema = new Schema(
		{	
			visual: {type: Schema.ObjectId, ref: 'Visual', required: true },
			sensor: {type: Schema.ObjectId, ref: 'Sensor', required: true },
			color: {type: String, default:'#ff0000'},
			channel: {type: String, default:'none'},
			max_val: {type: Number, default:100},
			min_val: {type: Number, default:0},
			max_range: {type: Number, default:100},
			min_range: {type: Number, default:0},
			max_color: {type: String, default:'#ff0000'},
			min_color: {type: String, default:'#008000'}
		}
	);



GlyphSchema
.virtual('name')
.get(function () {
		return this.glyph_name;
	}
	);

GlyphSchema
.virtual('url')
.get(function () {
		return '/' + this._id;
	}
	);

module.exports = mongoose.model('Glyph', GlyphSchema);