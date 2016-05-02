var ffConfig = {cfg:{},api:{},url:{},employees:[],loaders:[],local_employee:null};
ffConfig.api.url = "https://app.firmafon.dk/api/v2/";
ffConfig.api.dial = ffConfig.api.url+"switch/dial/";
ffConfig.api.calls = ffConfig.api.url+"calls/";
ffConfig.api.nodes = ffConfig.api.url+"call_nodes/";
ffConfig.api.employees = ffConfig.api.url+"employees/";
ffConfig.api.employee = ffConfig.api.url+"employee/";

//Only enable for testing live calls
ffConfig.cfg.callsActivated = true;
ffConfig.cfg.call_uuid = null;
ffConfig.cfg.in_call_transfer = false;

ffConfig.cfg.fetch_interval = null;
ffConfig.cfg.show_interval = null;
ffConfig.cfg.fetch_timer = 10;//Seconds. Interval timer for reloading employee list from server

ffConfig.cfg.excludes = ["bredbånd","data"];


/** Main Handler for firmafon
 *
 */
var FirmafonHandler = function() {
console.log("FirmafonHandler(firmafon) by: Søren Pedersen");

    this.add_Loader = function(loader) {
        //Add data loaders to this array
        //All data loaders must contain the public methods:
        //preload() & load()
        ffConfig.loaders[ ffConfig.loaders.length ] = loader;
    }

    this.preloader = function(callback) {
        //Make sure java interfaces is ready
        DeskBox.ready(function() {
           FirmafonAuth.resize_ToNormal();

           //Get access token from java interface and save in config
           ffConfig.api.token = FirmafonAuth.token();

            for (var i=0; i<ffConfig.loaders.length; i++) {
                ffConfig.loaders[i].preload();
            }

            try { callback(); }
            catch(e) {}
        });
    }

    this.loader = function() {
        clearInterval( ffConfig.cfg.fetch_interval );
        var timer = ffConfig.cfg.fetch_timer * 1000;

        //Make sure java interfaces is ready
        DeskBox.ready(function() {
            ffConfig.cfg.fetch_interval = setInterval(function() {

                for (var i=0; i<ffConfig.loaders.length; i++) {
                    ffConfig.loaders[i].load();
                }

            }, timer);

        });
    }

    /** return employee data
     * @param i int
     * @return Object
     */
    this.employee = function(i) {
        return ffConfig.employees[i];
    }

    /** Dial a number
     * @param number int
     */
    this.dial = function(number) {
        var url = ffConfig.api.dial + "&to_number="+number;
        console.log("Dial>> "+url);

        /**** WARNING WILL MAKE CALL! ***/
        if (ffConfig.cfg.callsActivated) {
            xLoader.post(ffConfig.api.dial,"to_number="+number,function(data) {
                console.log("Dial result: "+data);
            });

        }
        /******/

    }

     /** Dial a number
         * @param number int
         */
    this.call_transfer = function(employee_id) {
        var url_transfer = ffConfig.api.nodes + ffConfig.cfg.node_uuid + "/transfer";
        var url_hangup = ffConfig.api.nodes + ffConfig.cfg.node_uuid + "/hangup";
        console.log("Transfer>> "+url_transfer +" " + url_hangup);

        var transf = {endpoint:"Employee#"+employee_id,type:"attended",access_token:ffConfig.api.token};

        /**** WARNING WILL TRANSFER CALL! ***/
        if (ffConfig.cfg.callsActivated) {
            xLoader.post(url_transfer,transf,function(data) {
                console.log("Transfer result: "+data);

                ffCalls.call_Active(number,function(data) {
                    var nodes = data.calls[0].nodes;
                    var call = data.calls[0];

                    xLoader.post(url_hangup,"",function(data) {
                        console.log("Hangup result: "+data);
                    });
                });

            });

        }
        /******/

    }

    this.dnd = function(state) {
        var dnd = ffConfig.api.employee + "?access_token="+ffConfig.api.token;
        var payload = {"employee":{"cloak_reception_id":null,"do_not_disturb":state,"dnd_timeout_at":null}};

        this.notify("dnd","Do not disturb: "+state);

        xLoader.put(dnd,payload,function(data) {
            data = JSON.stringify(data);
            console.log(data);


            //jNotify.icon( "do_not_disturb" );
            //jNotify.message( "Do not disturb" );
        });
    }

    /** Search the list of employee names
     * testing string from beginning
     *
     * @param id String
     */
    this.search = function(id) {
        var timerout;

        //Listen for keyUp on id
        inget.keyUp(id,function(data) {
            alert(data);
            var list = [];

            for(var i=0; i<ffConfig.employees.length; i++) {
                //Get next employee
                var e = ffConfig.employees[i];
                //Get name lowercase
                var n = e.name().toLowerCase();

                //Test for match on lowercase data
                if (n.startsWith(data.toLowerCase())) {
                    alert("Match: "+e.name());
                    //On match add employee to output list
                    list[ list.length ] = e;

                    $("#emp"+e.id()).show();
                }
                else { $("#emp"+e.id()).hide(); }

            }

        });

    }

    this.is_Excluded = function(employee) {
        out = false;

        for (var i=0; i<ffConfig.cfg.excludes.length; i++) {
            if ( (employee.name().toLowerCase().indexOf( ffConfig.cfg.excludes[i].toLowerCase() ) > -1) || (employee.number() == null) ) { out = true; }
        }

        return out;
    }

    this.notify = function(presence,message) {
        console.log(presence);
        if (presence == "ringing_") {
            jNotify.icon_large( presence );
            jNotify.message("Ringing");
        }
        else if ( presence == "dnd" ) {
            jNotify.icon_large( "do_not_disturb" );
            jNotify.message( message );
        }
        else {
             jNotify.icon( presence );
             if (message !== undefined) { jNotify.message( message ); }
        }
    }
}