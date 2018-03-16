/*var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
    title: String,
    content: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema); 
*/


var mongoose = require('mongoose');

var MainSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
    sname: String
});

module.exports = mongoose.model('Main', MainSchema);