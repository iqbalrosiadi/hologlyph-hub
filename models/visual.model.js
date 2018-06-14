var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VisualSchema = new Schema(
		{
			glyph_name: {type: String},
			glyph_type: {type: String, default:'Sphere'},
			marker: {type: String},
			glyph: [{type: Schema.ObjectId, ref: 'Glyph'}],
			x_pos: {type: String},
			y_pos: {type: String},
			z_pos: {type: String},
			x_rot: {type: String},
			y_rot: {type: String},
			z_rot: {type: String}
		}
);


VisualSchema
.virtual('name')
.get(function () {
		return this.sensor_name;
	}
	);



VisualSchema
.virtual('url')
.get(function () {
		return '/detail/visual/' + this._id;
	}
	);

module.exports = mongoose.model('Visual', VisualSchema);