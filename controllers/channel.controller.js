var async = require('async');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Channel = require('../models/channel.model.js');

// Display list of device
exports.channel_list = function(req, res, next)  {

  Channel.find()
    .sort([['channel_name', 'ascending']])
    .exec(function (err, list_channels) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('channel_list', { title: 'Channel List', list_channel: list_channels});
    });

};

// Display list of device
exports.channel_detail = function(req, res, next) {
	async.parallel({

		channel: function(callback) {
			Channel.findById(req.params.id)
			.exec(callback);

		},

	},
	function(err, results){
		if (err) { return next(err); }
		if (results.channel==null) { // No results.
            var err = new Error('Channel not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('channel_detail', { title: 'Channel Detail', channel: results.channel } );

	});
	



};

// Display list of device
exports.channel_create_get = function(req, res) {
	res.render('channel_form', { title: 'Create Channel' });
};

// Display list of device
exports.channel_create_post =  [
		
		body('channel_name', 'Channel name required').isLength({ min: 1 }).trim(),

		sanitizeBody('channel_name').trim().escape(),

		(req, res, next) => {
			const errors = validationResult(req);
			
			console.log("name of the channel before " + req.body.channel_name);
			var channel = new Channel(
	          { channel_name: req.body.channel_name }
	        );
			console.log("name of the channel after " + channel._id);

	        if (!errors.isEmpty()) {
	        	res.render('channel_form', { title: 'Create Channel', channel: channel, errors: errors.array()});
	        return;
	        }
	        else {

	        	Channel.findOne({ 'channel_name': req.body.channel_name })
	        		.exec( function(err, found_channel){
	        			if (err){ return next(err); }

	        			if (found_channel) {
	        				res.redirect(found_channel.url);

	        			}
	        			else {

	        				channel.save(function (err){
	        					if (err) { return next(err); }
	                            // Genre saved. Redirect to genre detail page.
	                           // console.log("name of the channel " + channel.channel_name);
	                            res.redirect(channel.url);

	        				});

	        			}


	        		});

	        }

		}

];

// Display list of device
exports.channel_delete_get = function(req, res, next) {
	 async.parallel({
        channel: function(callback) {
            Channel.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.channel==null) { // No results.
            res.redirect('/detail/channels');
        }
        // Successful, so render.
        res.render('channel_delete', { title: 'Delete Channel', channel: results.channel } );
    });



};

// Display list of device
exports.channel_delete_post = function(req, res, next) {

	  async.parallel({
        channel: function(callback) {
            Channel.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
       /* if (results.genre_books.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
            return;
        }
        else { */
            // Genre has no books. Delete object and redirect to the list of genres.
            Channel.findByIdAndRemove(req.body.id, function deleteChannel(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                res.redirect('/detail/channels');
            });

        //}
    });
};

// Display list of device
exports.channel_update_get = function(req, res, next) {
	    Channel.findById(req.params.id, function(err, channel) {
        if (err) { return next(err); }
        if (channel==null) { // No results.
            var err = new Error('Channel not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('channel_form', { title: 'Update Channel', channel: channel });
    });
};

// Display list of device
exports.channel_update_post = [
   
    // Validate that the name field is not empty.
    body('channel_name', 'Channel name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('channel_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
        var channel = new Channel(
          {
          channel_name: req.body.channel_name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('channel_form', { title: 'Update Channel', channel: channel, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Channel.findByIdAndUpdate(req.params.id, channel, {}, function (err,thechannel) {
                if (err) { return next(err); }
                   // Successful - redirect to channel detail page.
                   res.redirect(thechannel.url);
                });
        }
    }
];