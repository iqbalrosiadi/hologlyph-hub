var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GlyphSchema = new Schema(
		{
		glyph_name: {type: String, required: true, min: 3, max: 100}
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
		return '/detail/glyph/' + this._id;
	}
	);

module.exports = mongoose.model('Glyph', GlyphSchema);