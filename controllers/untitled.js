
        
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
                var k;
                console.log(list_devices[i].sensor[j].sensor_name);
                obj=obj+"{";
                obj=obj+'"sensor_name":"'+list_devices[i].sensor[j].sensor_name+'",';
                obj=obj+'"sensor_type":"'+list_devices[i].sensor[j].sensor_type+'",';
                obj=obj+'"_id":"'+list_devices[i].sensor[j]._id+'",';
                obj=obj+"}";
                if(j!=(list_devices[i].sensor.length-1)){obj=obj+",";}
            } 
            obj=obj+'],';
            //console.log(list_devices[i].sensor[0].dataset);
            obj=obj+'"_id":"'+list_devices[i]._id+'",';
            obj=obj+'"marker":"'+list_devices[i].marker+'",';
            obj=obj+'"glpyh_type":"'+list_devices[i].glyph_type+'",';
            obj=obj+'"visual_name":"'+list_devices[i].glyph_name+'"';
            obj=obj+"}";
            if(i!=(list_devices.length-1)){obj=obj+",";}

        }
        //console.log(list_devices[0].sensor[1].dataset);
        obj= obj+"]";

        var dataset = JSON.parse(obj);
        console.log(obj);
        //JSON.stringify( blabla, undefined, 4 )