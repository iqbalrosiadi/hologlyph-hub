var async = require('async');

var Sensor = require('../models/sensor.model.js');
var Device = require('../models/device.model.js');
var Glyph = require('../models/glyph.model.js');
var Visual = require('../models/visual.model.js');
var Channel = require('../models/channel.model.js');
var Marker = require('../models/marker.model.js');
var Data = require('../models/data.model.js');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');



var glyph_model_list='[';
glyph_model_list=glyph_model_list+'{"glyph_type":"Sphere"},';
glyph_model_list=glyph_model_list+'{"glyph_type":"Sun"},';
glyph_model_list=glyph_model_list+'{"glyph_type":"Fire"}';
glyph_model_list=glyph_model_list+']';
var glyph_type = JSON.parse(glyph_model_list);

var bar_type_list='[';
bar_type_list=bar_type_list+'{"bar_type":"Line Chart"},';
bar_type_list=bar_type_list+'{"bar_type":"Bar Chart"}';
bar_type_list=bar_type_list+']';
var bar_type = JSON.parse(bar_type_list);


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
exports.new_glyph_create_get = function(req, res, next) {
        async.parallel({
        channels: function(callback){
            Channel.find(callback);
        },
        marker: function(callback){ 
            Marker.find(callback);
        },
        sensor: function(callback){ 
            Sensor.find(callback);
        },
        visual: function(callback){ 
        Visual.find(callback);
        },
    }, function(err, results){
        if (err) { return next(err); }
        res.render('new_glyph_form', { title: 'Create a New Glyph', 
            channel_list: results.channels, mark_list: results.sensor, visual: results.visual,  
            sensor: results.sensor, marker_list: results.marker, glyph_type: glyph_type, errors: err });

    });
};


// Display list of device
exports.new_glyph_create_post =  [
        
       // body('glyph_name', 'Mark name required').isLength({ min: 1 }).trim(),

        sanitizeBody('glyph_name').trim().escape(),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                        async.parallel({
                            channels: function(callback){
                                Channel.find(callback);
                            },
                            marker: function(callback){ 
                                Marker.find(callback);
                            },
                            sensor: function(callback){ 
                                Sensor.find(callback);
                            },
                        }, function(err, results){
                            if (err) { return next(err); }
                            res.render('new_glyph_form', { title: 'Create a New Glyph', 
                                channel_list: results.channels, mark_list: results.sensor, visual: results.sensor,  
                                sensor: results.sensor, marker_list: results.marker, glyph_type: glyph_type, errors: err });

                        });
                //res.render('new_glyph_form', { title: 'Create a New Glyph', glyph: glyph, errors: errors.array()});
            return;
            }
            else {
            
            console.log("name of the glyph before " + req.body.glyph_name);
            var visual = new Visual(
              { glyph_name: req.body.glyph_name,
                glyph_type: req.body.glyph_type,
                visual_type: 'glyph',
                default_color:req.body.default_color,
                marker: req.body.Marker,
                x_pos: req.body.x_axis,
                y_pos: req.body.y_axis,
                z_pos: req.body.z_axis,
                x_rot: req.body.x_rot,
                y_rot: req.body.y_rot,
                z_rot: req.body.z_rot
              }
            );

            if ((req.body.opcity_data!='nothing') && (typeof req.body.opcity_data != 'undefined'))
            {
                var glyph_opacity = new Glyph(
                  { 
                    visual: visual._id,
                    channel: 'opacity',
                    sensor: req.body.opacity_data, //substr(req.body.opacity_data, 0, 0),
                    min_val: req.body.opacity_min_val,
                    max_val: req.body.opacity_max_val,
                    min_range: req.body.opacity_min_range,
                    max_range: req.body.opacity_max_range

                  }
                );

                visual.glyph.push(glyph_opacity._id);
            };

            if ((req.body.color_data!='nothing') && (typeof req.body.color_data != 'undefined'))
            {
                var glyph_color = new Glyph(
                  { 
                    visual: visual._id,
                    channel: 'color',
                    sensor: req.body.color_data, //substr(req.body.opacity_data, 0, 0),
                    min_val: req.body.color_min_val,
                    max_val: req.body.color_max_val,
                    color_min_range: req.body.color_min_range,
                    color_max_range: req.body.color_max_range

                  }
                );

                visual.glyph.push(glyph_color._id);
            };

            if ((req.body.size_data!='nothing') && (typeof req.body.size_data != 'undefined'))
            {
                var glyph_size = new Glyph(
                  { 
                    visual: visual._id,
                    channel: 'size',
                    sensor: req.body.size_data, //substr(req.body.opacity_data, 0, 0),
                    min_val: req.body.size_min_val,
                    max_val: req.body.size_max_val,
                    min_range: req.body.size_min_range,
                    max_range: req.body.size_max_range

                  }
                );

                visual.glyph.push(glyph_size._id);
            };

                Visual.findOne({ 'glyph_name': req.body.glyph_name })
                    .exec( function(err, found_glyph){
                        if (err){ return next(err); }

                        if (found_glyph) {
                            res.redirect(found_glyph.url);

                        }
                        else {
                            console.log("Value _id "+ visual._id);
                            visual.save(function (err){
                                if (err) { return next(err); }

                                if ((req.body.size_data!='nothing') && (typeof req.body.size_data != 'undefined'))
                                {
                                    glyph_size.save(function (err){
                                    if (err) { return next(err); }
                                    });
                                }

                                if ((req.body.opcity_data!='nothing') && (typeof req.body.opcity_data != 'undefined'))
                                {
                                    glyph_opacity.save(function (err){
                                    if (err) { return next(err); }
                                    });
                                }

                                if ((req.body.color_data!='nothing') && (typeof req.body.color_data != 'undefined'))
                                {
                                    glyph_color.save(function (err){
                                    if (err) { return next(err); }
                                    });
                                }



                                res.redirect('/');

                            });

                        }


                    });

            }

        }

];

exports.new_chart_create_get = function(req, res, next) {
        async.parallel({
        glyphs: function(callback){ 
            Glyph.find(callback);
        },
        marker: function(callback){ 
            Marker.find(callback);
        },
        sensor: function(callback){ 
            Sensor.find(callback);
        },
    }, function(err, results){
        if (err) { return next(err); }
        res.render('new_chart_form', { title: 'Create a New Chart', 
            mark_list: results.sensor, visual: results.sensor,  
            sensor: results.sensor, marker_list: results.marker, bar_type: bar_type, errors: err });

    });
};



// Display list of device
exports.new_chart_create_post =  [
        
       // body('glyph_name', 'Mark name required').isLength({ min: 1 }).trim(),

        sanitizeBody('glyph_name').trim().escape(),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                        async.parallel({
                            channels: function(callback){
                                Channel.find(callback);
                            },
                            marker: function(callback){ 
                                Marker.find(callback);
                            },
                            sensor: function(callback){ 
                                Sensor.find(callback);
                            },
                        }, function(err, results){
                            if (err) { return next(err); }
                            res.render('new_glyph_form', { title: 'Create a New Glyph', 
                                channel_list: results.channels, mark_list: results.sensor, visual: results.sensor,  
                                sensor: results.sensor, marker_list: results.marker, glyph_type: glyph_type, errors: err });

                        });
                //res.render('new_glyph_form', { title: 'Create a New Glyph', glyph: glyph, errors: errors.array()});
            return;
            }
            else {
            
            //console.log("name of the glyph before " + req.body.glyph_name);
            var visual = new Visual(
              { glyph_name: req.body.glyph_name,
                glyph_type: req.body.type,
                visual_type: 'bar_line',
                default_color:req.body.default_color,
                max_batch:req.body.max_batch,
                height:req.body.height,
                width:req.body.width,
                marker: req.body.Marker,
                x_pos: req.body.x_axis,
                y_pos: req.body.y_axis,
                z_pos: req.body.z_axis,
                x_rot: req.body.x_rot,
                y_rot: req.body.y_rot,
                z_rot: req.body.z_rot
              }
            );

            var vars = [];

            for(var i=2; i<=parseInt(req.body.counter); i++)
            {
                console.log(req.body['glyph'+i]);
                if ((req.body['glyph'+i]!='nothing') && (typeof req.body['glyph'+i] != 'undefined'))
                {
                    var glyph_chart = new Glyph(
                      { 
                        visual: visual._id,
                        sensor: req.body['glyph'+i], 
                        min_val: req.body['min_val'+i],
                        max_val: req.body['max_val'+i],
                        color: req.body['def_color'+i]

                      }
                    );

                    visual.glyph.push(glyph_chart._id);
                    vars[i] = glyph_chart;
                    console.log(vars[i]);
                };

                

            }

                Visual.findOne({ 'glyph_name': req.body.glyph_name })
                    .exec( function(err, found_glyph){
                        if (err){ return next(err); }

                        if (found_glyph) {
                            res.redirect(found_glyph.url);

                        }
                        else {
                            console.log("Value _id "+ visual._id);
                            visual.save(function (err){
                                if (err) { return next(err);}
                                for(var i=2; i<=vars.length; i++)
                                {
                                    if ((vars[i]!='nothing') && (typeof vars[i] != 'undefined'))
                                    {
                                        vars[i].save(function (err){
                                        if (err) { return next(err); }
                                        console.log('SUCCESS '+vars[i]);
                                        });
                                    }
                                        
                                }


                                res.redirect('/');

                            });

                        }


                    });

            }

        }

];



exports.new_scatter_create_get = function(req, res, next) {
        async.parallel({
        glyphs: function(callback){ 
            Glyph.find(callback);
        },
        marker: function(callback){ 
            Marker.find(callback);
        },
        sensor: function(callback){ 
            Sensor.find(callback);
        },
    }, function(err, results){
        if (err) { return next(err); }
        res.render('new_scatter_plot', { title: 'Create a New Scatter Plot', 
            mark_list: results.sensor, visual: results.sensor,  
            sensor: results.sensor, marker_list: results.marker, bar_type: bar_type, errors: err });

    });
};



// Display list of device
exports.new_scatter_create_post =  [
        
       // body('glyph_name', 'Mark name required').isLength({ min: 1 }).trim(),

        sanitizeBody('glyph_name').trim().escape(),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                        
                async.parallel({
                glyphs: function(callback){ 
                    Glyph.find(callback);
                },
                marker: function(callback){ 
                    Marker.find(callback);
                },
                sensor: function(callback){ 
                    Sensor.find(callback);
                },
            }, function(err, results){
                if (err) { return next(err); }
                res.render('new_scatter_plot', { title: 'Create a New Scatter Plot', 
                    mark_list: results.sensor, visual: results.sensor,  
                    sensor: results.sensor, marker_list: results.marker, bar_type: bar_type, errors: err });

            });
                //res.render('new_glyph_form', { title: 'Create a New Glyph', glyph: glyph, errors: errors.array()});
            return;
            }
            else {
            
            console.log("name of the glyph before " + req.body.glyph_name);
            var visual = new Visual(
              { glyph_name: req.body.glyph_name,
                glyph_type: 'scatter',
                visual_type: 'scatter',
                default_color:req.body.default_color,
                marker: req.body.Marker,
                x_pos: req.body.x_axis,
                y_pos: req.body.y_axis,
                z_pos: req.body.z_axis,
                x_rot: req.body.x_rot,
                y_rot: req.body.y_rot,
                z_rot: req.body.z_rot
              }
            );

            if (req.body.scat_x_axis!='nothing')
            {
                var glyph_x = new Glyph(
                  { 
                    visual: visual._id,
                    channel: 'x_axis',
                    sensor: req.body.scat_x_axis, //substr(req.body.opacity_data, 0, 0),
                    min_val: req.body.min_val_x,
                    max_val: req.body.max_val_x,
                    color: req.body.def_color_x

                  }
                );

                visual.glyph.push(glyph_x._id);
            };


            if (req.body.scat_y_axis!='nothing')
            {
                var glyph_y = new Glyph(
                  { 
                    visual: visual._id,
                    channel: 'y_axis',
                    sensor: req.body.scat_y_axis, //substr(req.body.opacity_data, 0, 0),
                    min_val: req.body.min_val_y,
                    max_val: req.body.max_val_y,
                    color: req.body.def_color_y

                  }
                );

                visual.glyph.push(glyph_y._id);
            };


                Visual.findOne({ 'glyph_name': req.body.glyph_name })
                    .exec( function(err, found_glyph){
                        if (err){ return next(err); }

                        if (found_glyph) {
                            res.redirect(found_glyph.url);

                        }
                        else {
                            console.log("Value _id "+ visual._id);
                            visual.save(function (err){
                                if (err) { return next(err); }

                                if ((req.body.scat_y_axis!='nothing') && (typeof req.body.scat_y_axis != 'undefined'))
                                {
                                    glyph_y.save(function (err){
                                    if (err) { return next(err); }
                                    });
                                }

                                if ((req.body.scat_x_axis!='nothing') && (typeof req.body.scat_x_axis != 'undefined'))
                                {
                                    glyph_x.save(function (err){
                                    if (err) { return next(err); }
                                    });
                                }

                                res.redirect('/');

                            });

                        }


                    });

            }

        }

];


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