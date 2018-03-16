var async = require('async');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Marker = require('../models/marker.model.js');

// Display list of device
exports.marker_list = function(req, res, next)  {

  Marker.find()
    .sort([['marker_name', 'ascending']])
    .exec(function (err, list_markers) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('marker_list', { title: 'Marker List', list_marker:  list_markers});
    });

};

// Display list of device
exports.marker_detail = function(req, res, next) {
	async.parallel({

		marker: function(callback) {
			Marker.findById(req.params.id)
			.exec(callback);

		},

	},
	function(err, results){
		if (err) { return next(err); }
		if (results.marker==null) { // No results.
            var err = new Error('Marker not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('marker_detail', { title: 'Marker Detail', marker: results.marker } );

	});
	



};

// Display list of device
exports.marker_create_get = function(req, res) {
	res.render('marker_form', { title: 'Create Marker' });
};

// Display list of device
exports.marker_create_post =  [
		
		body('marker_name', 'Marker name required').isLength({ min: 1 }).trim(),

		sanitizeBody('marker_name').trim().escape(),

		(req, res, next) => {
			const errors = validationResult(req);
			
			console.log("name of the marker before " + req.body.marker_name);
			var marker = new Marker(
	          { marker_name: req.body.marker_name }
	        );
			console.log("name of the marker after " + marker.marker_name);

	        if (!errors.isEmpty()) {
	        	res.render('marker_form', { title: 'Create Marker', marker: marker, errors: errors.array()});
	        return;
	        }
	        else {

	        	Marker.findOne({ 'marker_name': req.body.marker_name })
	        		.exec( function(err, found_marker){
	        			if (err){ return next(err); }

	        			if (found_marker) {
	        				res.redirect(found_marker.url);

	        			}
	        			else {

	        				marker.save(function (err){
	        					if (err) { return next(err); }
	                            // Genre saved. Redirect to genre detail page.
	                           // console.log("name of the marker " + marker.marker_name);
	                            res.redirect(marker.url);

	        				});

	        			}


	        		});

	        }

		}

];

// Display list of device
exports.marker_delete_get = function(req, res, next) {
	 async.parallel({
        marker: function(callback) {
            Marker.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.marker==null) { // No results.
            res.redirect('/detail/markers');
        }
        // Successful, so render.
        res.render('marker_delete', { title: 'Delete Marker', marker: results.marker } );
    });



};

// Display list of device
exports.marker_delete_post = function(req, res, next) {

	  async.parallel({
        marker: function(callback) {
            Marker.findById(req.params.id).exec(callback);
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
            Marker.findByIdAndRemove(req.body.id, function deleteMarker(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                res.redirect('/detail/markers');
            });

        //}
    });
};

// Display list of device
exports.marker_update_get = function(req, res, next) {
	    Marker.findById(req.params.id, function(err, marker) {
        if (err) { return next(err); }
        if (marker==null) { // No results.
            var err = new Error('Marker not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('marker_form', { title: 'Update Marker', marker: marker });
    });
};

// Display list of device
exports.marker_update_post = [
   
    // Validate that the name field is not empty.
    body('marker_name', 'Marker name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('marker_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
        var marker = new Marker(
          {
          marker_name: req.body.marker_name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('marker_form', { title: 'Update Marker', marker: marker, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Marker.findByIdAndUpdate(req.params.id, marker, {}, function (err,themarker) {
                if (err) { return next(err); }
                   // Successful - redirect to marker detail page.
                   res.redirect(themarker.url);
                });
        }
    }
];