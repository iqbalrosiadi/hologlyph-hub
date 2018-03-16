module.exports = function(app) {

    var notes = require('../controllers/note.controller.js');

    // Create a new Note
    app.post('/notes', notes.create);

    // Create a new Note
    app.post('/sensor', notes.initial_create);

    // Retrieve all Notes
    app.get('/notes', notes.findAll);

    // Retrieve a single Note with sensorId
    app.get('/notes/:sensorId', notes.findOne);

    // Update a Note with sensorId
    app.put('/notes/:sensorId', notes.update);

     // Update a Note with sensorId
    app.put('/sensors/:sensorId/:fieldId', notes.append);

     // Update a Note with sensorId
    app.get('/sensors/:sensorId/:fieldId', notes.showOne);

    // Delete a Note with sensorId
    app.delete('/notes/:sensorId', notes.delete);
}
