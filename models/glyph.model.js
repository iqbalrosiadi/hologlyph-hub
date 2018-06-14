var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GlyphSchema = new Schema(
		{	
			visual: {type: Schema.ObjectId, ref: 'Visual', required: true },
			update_date: {type: Date, default: Date.now},
			sensor: {type: Schema.ObjectId, ref: 'Sensor', required: true },
			sensor_name: {type: String},
			glyph_name: {type: String, required: true, min: 3, max: 100},
			channel: {type: String, default:'none'},
			max_val: {type: Number, default:100},
			min_val: {type: Number, default:0},
			max_color: {type: String, default:'#ff0000'},
			min_color: {type: String, default:'#008000'},
			def_color: {type: String, default:'#000000'},
			set_size: {type: String, default:'0.5'},
			opacity: {type: String, min:'0%' , default:'100%'}
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