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
glyph_model_list=glyph_model_list+'{"glyph_type":"Sphere Glyph"},';
glyph_model_list=glyph_model_list+'{"glyph_type":"Sun Glyph"},';
glyph_model_list=glyph_model_list+'{"glyph_type":"Fire Glyph"}';
glyph_model_list=glyph_model_list+']';
var glyph_type = JSON.parse(glyph_model_list);

var bar_type_list='[';
bar_type_list=bar_type_list+'{"bar_type":"Line Chart"},';
bar_type_list=bar_type_list+'{"bar_type":"Bar Chart"}';
bar_type_list=bar_type_list+']';
var bar_type = JSON.parse(bar_type_list);


var x;
var marker_list='[';
for(x=0; x<25; x++)
    {
    if(x<10)
    {
        marker_list=marker_list+'{"marker_name":"Mark-0'+x+'"},';
    }
    else
    {
        marker_list=marker_list+'{"marker_name":"Mark-'+x+'"},';
    }    
    }
    marker_list=marker_list+'{"marker_name":"Mark-25"}';
marker_list=marker_list+']';
var mark_list = JSON.parse(marker_list);

exports.visual_list = function(req, res, next) {
    Visual.find() //.select('glyph_name _id marker glyph_type visual_type')
    .populate({
        path: 'glyph',
        populate: { 
            path: 'sensor',
            select: '_id sensor_name sensor_type'
        },
        select: 'channel color _id'
    })
    .exec(function(err, list_devices){
        if (err) { return next(err); }

                var obj = "[" ;
        //obj.device = [];
        var i;
        
        for(i=0; i<list_devices.length; i++)
        {
            obj=obj+"{";

            var j;
            obj=obj+'"glyph_list":[';
            for(j=0; j<list_devices[i].glyph.length; j++)
            {
                
                /* console.log(list_devices[i].glyph[j].channel);
                console.log(list_devices[i].glyph[j].color);
                console.log(list_devices[i].glyph[j]._id); */
                //console.log(list_devices[i].glyph_name+" : ");
                //console.log(list_devices[i].glyph[j]);
                //console.log(list_devices[i].glyph[j].sensor);
                //console.log(list_devices[i].glyph[j].sensor.sensor_name);
                obj=obj+"{";
                obj=obj+'"glyph_id":"'+list_devices[i].glyph[j]._id+'",';
                obj=obj+'"channel":"'+list_devices[i].glyph[j].channel+'",';
                obj=obj+'"color":"'+list_devices[i].glyph[j].color+'",';
                if ((list_devices[i].glyph[j].sensor!=null) && (typeof list_devices[i].glyph[j].sensor != 'undefined')) 
                    { 
                        obj=obj+'"sensor_id":"'+list_devices[i].glyph[j].sensor._id+'",';
                        obj=obj+'"sensor_name":"'+list_devices[i].glyph[j].sensor.sensor_name+'",';
                        obj=obj+'"sensor_type":"'+list_devices[i].glyph[j].sensor.sensor_type+'"';
                    }
                    else
                    {
                        obj=obj+'"sensor_id":"deleted",';
                        obj=obj+'"sensor_name":"deleted",';
                        obj=obj+'"sensor_type":"deleted"';
                    }
                obj=obj+"}";
                if(j!=(list_devices[i].glyph.length-1)){obj=obj+",";}
            } 
            obj=obj+'],';
            //console.log(list_devices[i].sensor[0].dataset);
            obj=obj+'"_id":"'+list_devices[i]._id+'",';
            
            obj=obj+'"width":"'+list_devices[i].width+'",';
            obj=obj+'"height":"'+list_devices[i].height+'",';
            obj=obj+'"max_batch":"'+list_devices[i].max_batch+'",';
            obj=obj+'"default_color":"'+list_devices[i].default_color+'",';
            
            obj=obj+'"x_pos":"'+list_devices[i].x_pos+'",';
            obj=obj+'"y_pos":"'+list_devices[i].y_pos+'",';
            obj=obj+'"z_pos":"'+list_devices[i].z_pos+'",';
            obj=obj+'"x_rot":"'+list_devices[i].x_rot+'",';
            obj=obj+'"y_rot":"'+list_devices[i].y_rot+'",';
            obj=obj+'"z_rot":"'+list_devices[i].z_rot+'",';

            obj=obj+'"visual_type":"'+list_devices[i].visual_type+'",';
            obj=obj+'"marker":"'+list_devices[i].marker+'",';
            obj=obj+'"glpyh_type":"'+list_devices[i].glyph_type+'",';
            obj=obj+'"visual_name":"'+list_devices[i].glyph_name+'"';
            console.log(list_devices[i].glyph_name+" : ");
            console.log(list_devices[i].glyph_name.glyph_list);
            obj=obj+"}";
            if(i!=(list_devices.length-1)){obj=obj+",";}
            //console.log(list_devices[i]);

        }
        
        obj= obj+"]";

        var dataset = JSON.parse(obj);
        //console.log(obj);

        res.render('visual_list', { title: 'Visualisation List', visual_list:dataset});
    });

};



exports.visual_detail = function(req, res, next) {
    Visual.find() //.select('glyph_name _id marker glyph_type visual_type')
    .populate({
        path: 'glyph',
        populate: { 
            path: 'sensor',
            select: '_id sensor_name sensor_type'
        },
        select: 'channel color _id'
    })
    .exec(function(err, list_devices){
        if (err) { return next(err); }

                var obj = "[" ;
        //obj.device = [];
        var i;
        console.log(JSON.stringify(list_devices, undefined, 4 ));
        
        obj= obj+"]";

        //var dataset = JSON.parse(obj);
        //console.log(obj);


        res.render('json_file', { title: 'Visualisation List' });//visual_list:JSON.stringify( dataset, undefined, 4 )});
    });

};




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
    }, function(err, results){
        if (err) { return next(err); }
        res.render('new_create_glyph_form', { title: 'Create a New Glyph', 
            channel_list: results.channels, mark_list: results.sensor,
            sensor: results.sensor, marker_list: mark_list, glyph_type: glyph_type, errors: err });

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
                visual_type: 'glyphs',
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

            if ((req.body.opacity_data!='nothing') && (typeof req.body.opacity_data != 'undefined'))
            {
                var glyph_opacity = new Glyph(
                  { 
                    visual: visual._id,
                    channel: 'Opacity',
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
                    channel: 'Color',
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
                    channel: 'Size',
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

                                if ((req.body.opacity_data!='nothing') && (typeof req.body.opacity_data != 'undefined'))
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



                                res.redirect('/detail/visualisation/list');

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
                visual_type: 'chart',
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
                                var counting = 1;
                                for(var i=2; i<=vars.length; i++)
                                {
                                    
                                    if ((vars[i]!='nothing') && (typeof vars[i] != 'undefined'))
                                    {
                                        vars[i].channel='Sensor '+counting;
                                        counting=counting+1;
                                        vars[i].save(function (err){
                                        if (err) { return next(err); }
                                        console.log('SUCCESS '+vars[i]);
                                        });
                                    }
                                        
                                }


                                res.redirect('/detail/visualisation/list');

                            });

                        }


                    });

            }

        }

];


// Display list of device
exports.new_chart_update_post =  [
        
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
              { 
                _id: req.body.visual_id,
                glyph_name: req.body.glyph_name,
                glyph_type: req.body.type,
                visual_type: 'chart',
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

            Glyph.deleteMany({"visual": req.body.visual_id }, function deleteChannel(err) {
                                if (err) { return next(err); }
                    });


            for(var i=2; i<=parseInt(req.body.counter); i++)
            {
                console.log(req.body['glyph'+i]);
                if ((req.body['glyph'+i]!='nothing') && (typeof req.body['glyph'+i] != 'undefined'))
                {
                    var glyph_chart = new Glyph(
                      { 
                        visual: req.body.visual_id,
                        sensor: req.body['glyph'+i], 
                        min_val: req.body['min_val'+i],
                        max_val: req.body['max_val'+i],
                        color: req.body['def_color'+i]

                      }
                    );

                    visual.glyph.push(glyph_chart._id);
                    vars[i] = glyph_chart;
                    //console.log(vars[i]);
                };

                

            }

                console.log("Value _id "+ visual._id);
                Visual.findByIdAndUpdate(visual._id, visual, function (err){
                    if (err) { return next(err);}
                    var counting = 1;

                    for(var i=2; i<=vars.length; i++)
                    {
                        
                        if ((vars[i]!='nothing') && (typeof vars[i] != 'undefined'))
                        {
                            vars[i].channel='Sensor '+counting;
                            counting=counting+1;
                            vars[i].save(function (err){
                            if (err) { return next(err); }
                            console.log('SUCCESS '+vars[i]);
                            });
                        }
                            
                    }
                    res.redirect('/detail/visualisation/list');
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
        res.render('new_create_scatter_plot', { title: 'Create a New Scatter Plot', 
            mark_list: results.sensor, 
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
                glyph_type: 'Scatter Plot',
                visual_type: 'scatterplot',
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
                    channel: 'X Axis',
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
                    channel: 'Y Axis',
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

                                res.redirect('/detail/visualisation/list');

                            });

                        }


                    });

            }

        }

];



// Display list of device
exports.new_glyph_update_get = function(req, res, next) {
        async.parallel({
        visual: function(callback){ 
                Visual.findById(req.params.id)
                .exec(callback);
        },
        marker: function(callback){ 
            Marker.find(callback);
        },
        sensor: function(callback){ 
            Sensor.find(callback);
        },
        glyph_size: function(callback) {
            Glyph.find({'visual':req.params.id, 'channel':'Size'})
            .populate('sensor')
            .exec(callback);
        },
        glyph_color: function(callback) {
        Glyph.find({'visual':req.params.id, 'channel':'Color'})
        .populate('sensor')
        .exec(callback);
        },
        glyph_opacity: function(callback) {
        Glyph.find({'visual':req.params.id, 'channel':'Opacity'})
        .populate('sensor')
        .exec(callback);
        },
    }, function(err, results){
        if (err) { return next(err); }

        console.log("HALLO");
        
        res.render('new_glyph_form', { title: 'Updating The New Glyph', 
            channel_list: results.channels, mark_list: results.sensor, visual: results.visual, glyph_type: glyph_type, 
            sensor: results.sensor, marker_list: results.marker, sensor_opacity: results.glyph_opacity[0],
            sensor_size: results.glyph_size[0], sensor_color: results.glyph_color[0], errors: err }); 

    });
};


// Display list of device
exports.new_glyph_update_post =  [
        
       // body('glyph_name', 'Mark name required').isLength({ min: 1 }).trim(),

        sanitizeBody('glyph_name').trim().escape(),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                        async.parallel({
                        visual: function(callback){ 
                                Visual.findById(req.params.id)
                                .exec(callback);
                        },
                        marker: function(callback){ 
                            Marker.find(callback);
                        },
                        sensor: function(callback){ 
                            Sensor.find(callback);
                        },
                        glyph_size: function(callback) {
                            Glyph.find({'visual':req.params.id, 'channel':'Size'})
                            .populate('sensor')
                            .exec(callback);
                        },
                        glyph_color: function(callback) {
                        Glyph.find({'visual':req.params.id, 'channel':'Color'})
                        .populate('sensor')
                        .exec(callback);
                        },
                        glyph_opacity: function(callback) {
                        Glyph.find({'visual':req.params.id, 'channel':'Opacity'})
                        .populate('sensor')
                        .exec(callback);
                        },
                    }, function(err, results){
                        if (err) { return next(err); }

                        console.log(results.glyph_size[0]);
                        
                        res.render('new_glyph_form', { title: 'Create a New Glyph', 
                            channel_list: results.channels, mark_list: results.sensor, visual: results.visual, glyph_type: glyph_type, 
                            sensor: results.sensor, marker_list: results.marker, sensor_opacity: results.glyph_opacity[0],
                            sensor_size: results.glyph_size[0], sensor_color: results.glyph_color[0], errors: err }); 

                    });
                //res.render('new_glyph_form', { title: 'Create a New Glyph', glyph: glyph, errors: errors.array()});
            return;
            }
            else {
            
            console.log("name of the glyph before " + req.body.glyph_name);
            var visual = new Visual(
              { 
                _id: req.body.visual_id,
                glyph_name: req.body.glyph_name,
                glyph_type: req.body.glyph_type,
                visual_type: 'glyphs',
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





            if ((req.body.opacity_data!='nothing') && (typeof req.body.opacity_data != 'undefined'))
            {
                var glyph_opacity = new Glyph(
                  { 
                    
                    visual: visual._id,
                    channel: 'Opacity',
                    sensor: req.body.opacity_data, //substr(req.body.opacity_data, 0, 0),
                    min_val: req.body.opacity_min_val,
                    max_val: req.body.opacity_max_val,
                    min_range: req.body.opacity_min_range,
                    max_range: req.body.opacity_max_range

                  }
                );

                if ((typeof req.body.sensor_opacity_id != 'undefined'))
                {
                    glyph_opacity._id=req.body.sensor_opacity_id
                };

                visual.glyph.push(glyph_opacity._id);
            };

            if ((req.body.color_data!='nothing') && (typeof req.body.color_data != 'undefined'))
            {
                var glyph_color = new Glyph(
                  { 
                    visual: visual._id,
                    channel: 'Color',
                    sensor: req.body.color_data, //substr(req.body.opacity_data, 0, 0),
                    min_val: req.body.color_min_val,
                    max_val: req.body.color_max_val,
                    color_min_range: req.body.color_min_range,
                    color_max_range: req.body.color_max_range

                  }
                );

                if ((typeof req.body.sensor_color_id != 'undefined'))
                {
                    glyph_color._id=req.body.sensor_color_id
                };

                visual.glyph.push(glyph_color._id);
            };

            if ((req.body.size_data!='nothing') && (typeof req.body.size_data != 'undefined'))
            {
                var glyph_size = new Glyph(
                  { 
                    visual: visual._id,
                    channel: 'Size',
                    sensor: req.body.size_data, //substr(req.body.opacity_data, 0, 0),
                    min_val: req.body.size_min_val,
                    max_val: req.body.size_max_val,
                    min_range: req.body.size_min_range,
                    max_range: req.body.size_max_range

                  }
                );

                if ((typeof req.body.sensor_size_id != 'undefined'))
                {
                    glyph_size._id=req.body.sensor_size_id
                };
                visual.glyph.push(glyph_size._id);
            };




                        Visual.findByIdAndUpdate(visual._id, visual, function (err){
                       if (err) { return next(err); }
                       if ((req.body.size_data!='nothing') && (typeof req.body.size_data != 'undefined'))
                       {
                           Glyph.findByIdAndUpdate(glyph_size._id, glyph_size,  { upsert: true },function (err){
                           if (err) { return next(err); }
                           console.log("SUCCESS RESULT :");
                           console.log(visual);
                           });
                       }
                       if ((req.body.opacity_data!='nothing') && (typeof req.body.opacity_data != 'undefined'))
                       {
                           Glyph.findByIdAndUpdate(glyph_opacity._id, glyph_opacity,  { upsert: true },function (err){
                           if (err) { return next(err); }
                           });
                       }
                       if ((req.body.color_data!='nothing') && (typeof req.body.color_data != 'undefined'))
                       {
                           Glyph.findByIdAndUpdate(glyph_color._id, glyph_color,  { upsert: true },function (err){
                           if (err) { return next(err); }
                           });
                       }
                       res.redirect('/detail/visualisation/list');
                   });

            }

        }

];


exports.new_scatter_update_get = function(req, res, next) {
        async.parallel({
        visual: function(callback){ 
                Visual.findById(req.params.id)
                .exec(callback);
        },
        marker: function(callback){ 
            Marker.find(callback);
        },
        sensor: function(callback){ 
            Sensor.find(callback);
        },
        glyph_y_axis: function(callback) {
        Glyph.find({'visual':req.params.id, 'channel':'Y Axis'})
        .populate('sensor')
        .exec(callback);
        },
        glyph_x_axis: function(callback) {
        Glyph.find({'visual':req.params.id, 'channel':'X Axis'})
        .populate('sensor')
        .exec(callback);
        },
    }, function(err, results){
        if (err) { return next(err); }

        console.log(results.glyph_y_axis[0]);
        res.render('new_scatter_plot', { title: 'Updating The Scatter Plot', 
            mark_list: results.sensor, visual: results.visual,  glyph_x_axis: results.glyph_x_axis[0], glyph_y_axis: results.glyph_y_axis[0],  
            sensor: results.sensor, marker_list: results.marker, bar_type: bar_type, errors: err });

    });
};





// Display list of device
exports.new_scatter_update_post =  [
        
       // body('glyph_name', 'Mark name required').isLength({ min: 1 }).trim(),

        sanitizeBody('glyph_name').trim().escape(),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                        
                    async.parallel({
                    visual: function(callback){ 
                            Visual.findById(req.params.id)
                            .exec(callback);
                    },
                    marker: function(callback){ 
                        Marker.find(callback);
                    },
                    sensor: function(callback){ 
                        Sensor.find(callback);
                    },
                    glyph_x_axis: function(callback) {
                        Glyph.find({'visual':req.params.id, 'channel':'X Axis'})
                        .exec(callback);
                    },
                    glyph_y_axis: function(callback) {
                    Glyph.find({'visual':req.params.id, 'channel':'Y Axis'})
                    .populate('sensor')
                    .exec(callback);
                    },
                    glyph_x_axis: function(callback) {
                    Glyph.find({'visual':req.params.id, 'channel':'X Axis'})
                    .populate('sensor')
                    .exec(callback);
                    },
                }, function(err, results){
                    if (err) { return next(err); }

                    console.log(results.glyph_y_axis[0].sensor.sensor_name);
                    res.render('new_scatter_plot', { title: 'Create a New Scatter Plot', 
                        mark_list: results.sensor, visual: results.visual,  glyph_x_axis: results.glyph_x_axis[0], glyph_y_axis: results.glyph_y_axis[0],  
                        sensor: results.sensor, marker_list: results.marker, bar_type: bar_type, errors: err });

                });
                //res.render('new_glyph_form', { title: 'Create a New Glyph', glyph: glyph, errors: errors.array()});
            return;
            }
            else {
            
            console.log("name of the glyph before " + req.body.glyph_name);
            var visual = new Visual(
              { 
                _id: req.body.visual_id,
                glyph_name: req.body.glyph_name,
                glyph_type: 'Scatter Plot',
                visual_type: 'scatterplot',
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

            if ((req.body.scat_x_axis!='nothing') && (typeof req.body.glyph_x_axis_id != 'undefined'))
            {
                var glyph_x = new Glyph(
                  { 
                    visual: req.body.visual_id,
                    channel: 'X Axis',
                    sensor: req.body.scat_x_axis, //substr(req.body.opacity_data, 0, 0),
                    min_val: req.body.min_val_x,
                    max_val: req.body.max_val_x,
                    color: req.body.def_color_x

                  }
                );

                if ((typeof req.body.glyph_x_axis_id != 'undefined'))
                {
                    glyph_x._id=req.body.glyph_x_axis_id
                };

                visual.glyph.push(glyph_x._id);
            };


            if ((req.body.scat_y_axis!='nothing') && (typeof req.body.glyph_y_axis_id != 'undefined'))
            {
                var glyph_y = new Glyph(
                  { 
                    visual: req.body.visual_id,
                    channel: 'Y Axis',
                    sensor: req.body.scat_y_axis, 
                    min_val: req.body.min_val_y,
                    max_val: req.body.max_val_y,
                    color: req.body.def_color_y

                  }
                );

                if ((typeof req.body.glyph_y_axis_id != 'undefined'))
                {
                    glyph_y._id=req.body.glyph_y_axis_id
                };
                visual.glyph.push(glyph_y._id);
            };



                console.log("Value _id "+ visual._id);
                Visual.findByIdAndUpdate(visual._id, visual, {}, function (err){
                    if (err) { return next(err); }
                    if ((req.body.scat_y_axis!='nothing') && (typeof req.body.scat_y_axis != 'undefined'))
                    {
                        Glyph.findByIdAndUpdate(glyph_y._id, glyph_y, {upsert: true}, function (err){
                        if (err) { return next(err); }
                        });
                    }
                    if ((req.body.scat_x_axis!='nothing') && (typeof req.body.scat_x_axis != 'undefined'))
                    {
                        Glyph.findByIdAndUpdate(glyph_x._id, glyph_x, {upsert: true}, function (err){
                        if (err) { return next(err); }
                        });
                    }
                    res.redirect('/detail/visualisation/list');
                });



            }

        }

];


exports.new_chart_update_get = function(req, res, next) {
        async.parallel({
        visual: function(callback){ 
                Visual.findById(req.params.id)
                .exec(callback);
        },
        marker: function(callback){ 
            Marker.find(callback);
        },
        sensor: function(callback){ 
            Sensor.find(callback);
        },
        glyph_chart: function(callback) {
        Glyph.find({'visual':req.params.id})
        .populate('sensor')
        .exec(callback);
        },
    }, function(err, results){
        if (err) { return next(err); }

        console.log(results.glyph_chart);
        res.render('new_chart_form', { title: 'Updating The Chart', 
            mark_list: results.sensor, visual: results.visual,  glyph_list: results.glyph_chart, glyph_counter: results.glyph_chart.length,  
            sensor: results.sensor, marker_list: results.marker, bar_type: bar_type, errors: err });

    });
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
exports.visual_delete_post = function(req, res, next) {
    console.log('HALLO'+req.params.id);

    async.parallel({
        visual: function(callback) {
            Visual.findById(req.params.id).exec(callback);
        },
        glyph: function(callback) {
            Glyph.find({'visual':req.params.id}).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }

              Glyph.deleteMany({"visual": results.visual._id }, function deleteChannel(err) {
                                if (err) { return next(err); }
                    });

              Visual.findByIdAndRemove(results.visual._id, function deleteChannel(err) {
                if (err) { return next(err); }
                res.redirect('/detail/visualisation/list');
            });

    });
};




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