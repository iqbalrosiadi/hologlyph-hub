var async = require('async');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Glyph = require('../models/glyph.model.js');

// Display list of device
exports.glyph_list = function(req, res, next)  {

  Glyph.find()
    .sort([['glyph_name', 'ascending']])
    .exec(function (err, list_glyphs) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('glyph_list', { title: 'Mark List', list_glyph:  list_glyphs});
    });

};

// Display list of device
exports.glyph_detail = function(req, res, next) {
	async.parallel({

		glyph: function(callback) {
			Glyph.findById(req.params.id)
			.exec(callback);

		},

	},
	function(err, results){
		if (err) { return next(err); }
		if (results.glyph==null) { // No results.
            var err = new Error('Mark not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('glyph_detail', { title: 'Mark Detail', glyph: results.glyph } );

	});
	



};

// Display list of device
exports.glyph_create_get = function(req, res) {
	res.render('glyph_form', { title: 'Create Mark' });
};

// Display list of device
exports.glyph_create_post =  [
		
		body('glyph_name', 'Mark name required').isLength({ min: 1 }).trim(),

		sanitizeBody('glyph_name').trim().escape(),

		(req, res, next) => {
			const errors = validationResult(req);
			
			console.log("name of the glyph before " + req.body.glyph_name);
			var glyph = new Glyph(
	          { glyph_name: req.body.glyph_name }
	        );
			console.log("name of the glyph after " + glyph.glyph_name);

	        if (!errors.isEmpty()) {
	        	res.render('glyph_form', { title: 'Create Mark', glyph: glyph, errors: errors.array()});
	        return;
	        }
	        else {

	        	Glyph.findOne({ 'glyph_name': req.body.glyph_name })
	        		.exec( function(err, found_glyph){
	        			if (err){ return next(err); }

	        			if (found_glyph) {
	        				res.redirect(found_glyph.url);

	        			}
	        			else {

	        				glyph.save(function (err){
	        					if (err) { return next(err); }
	                            // Genre saved. Redirect to genre detail page.
	                           // console.log("name of the glyph " + glyph.glyph_name);
	                            res.redirect(glyph.url);

	        				});

	        			}


	        		});

	        }

		}

];

// Display list of device
exports.glyph_delete_get = function(req, res, next) {
	 async.parallel({
        glyph: function(callback) {
            Glyph.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.glyph==null) { // No results.
            res.redirect('/detail/glyphs');
        }
        // Successful, so render.
        res.render('glyph_delete', { title: 'Delete Mark', glyph: results.glyph } );
    });



};

// Display list of device
exports.glyph_delete_post = function(req, res, next) {

	  async.parallel({
        glyph: function(callback) {
            Glyph.findById(req.params.id).exec(callback);
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
            Glyph.findByIdAndRemove(req.body.id, function deleteGlyph(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                res.redirect('/detail/glyphs');
            });

        //}
    });
};

// Display list of device
exports.glyph_update_get = function(req, res, next) {
	    Glyph.findById(req.params.id, function(err, glyph) {
        if (err) { return next(err); }
        if (glyph==null) { // No results.
            var err = new Error('Mark not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('glyph_form', { title: 'Update Mark', glyph: glyph });
    });
};

// Display list of device
exports.glyph_update_post = [
   
    // Validate that the name field is not empty.
    body('glyph_name', 'Mark name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('glyph_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
        var glyph = new Glyph(
          {
          glyph_name: req.body.glyph_name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('glyph_form', { title: 'Update Glyph', glyph: glyph, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Glyph.findByIdAndUpdate(req.params.id, glyph, {}, function (err,theglyph) {
                if (err) { return next(err); }
                   // Successful - redirect to glyph detail page.
                   res.redirect(theglyph.url);
                });
        }
    }
];