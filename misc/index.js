var express = require('express');
var bodyParser = require('body-parser');

// create express app
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))




// Configuring the database

var dbConfig = require('./config/database.config.js');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useMongoClient: true,
    keepAlive: true,
  	reconnectTries: Number.MAX_VALUE,
  	useMongoClient: true
});


mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
});




// define a simple route
app.get('/', function(req, res){
    res.json({"message": "This is a message for introduction"});
});


app.get('/client', function(req, res,next) {  
    res.sendFile(__dirname + '/client.html');
});

app.get('/thingspeak', function(req, res,next) {  
    res.sendFile(__dirname + '/2.json');
});

app.get('/datatmp', function(req, res,next) {  
    res.sendFile(__dirname + '/sample.json');
});

/*
io.on('connection', function(client) {  
    console.log('Client connected...');
    var testing = require(__dirname + '/app/controllers/note.controller.js');
    console.log(client);
    client.on('join', function(data) {
        console.log(data);
        client.emit('messages','halloha')

    });
    });
*/
// listen for requests
server.listen(3000, function(){
    console.log("Server is listening on port 3000");
});

//require('./app/routes/detail.routes.js')(app);

//var index = require('./routes/index');
//var users = require('./routes/users');

var detail = require('./app/routes/detail.routes.js'); 
app.use('/detail', detail);

