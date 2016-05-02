var ffConfig = {cfg:{},api:{},url:{},employees:[],loaders:[],local_employee:null};
ffConfig.api.url = "https://app.firmafon.dk/api/v2/";
ffConfig.api.dial = "http://mudlogic.dk/Apps/ff_post.php";
//ffConfig.api.dial = ffConfig.api.url+"switch/dial";
ffConfig.api.employees = ffConfig.api.url+"employees/";
ffConfig.api.employee = ffConfig.api.url+"employee/";

//Only enable for testing live calls
ffConfig.cfg.callsActivated = true;

ffConfig.cfg.fetch_interval = null;
ffConfig.cfg.show_interval = null;
ffConfig.cfg.fetch_timer = 10;//Seconds. Interval timer for reloading employee list from server

DeskBox.include("plugins/firmafon/firmafon_employee.js");

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
           //Get access token from java interface and save in config
           ffConfig.api.token = jFirmafon.token();
           ffConfig.api.dial = ffConfig.api.dial +"?access_token="+jFirmafon.token();

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
            xLoader.get(url,function(data) {
                alert(data);
            });
        }
        /******/

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
}

/** Firmafon employees loader
 *
 */
var Firmafon_EmployeesLoader = function(oid) {
console.log("Firmafon_EmployeeLoader by: Søren Pedersen");

    var output_id = oid;

    //Load employee data
    this.preload = function() {
            //URL to call for employee data
           ffConfig.api.employees = ffConfig.api.employees + "?access_token="+ffConfig.api.token;

            load_localEmployee();

           load_employeeData( ffConfig.api.employees,function() {
                //Load template container
                load_employeeContainers(ffConfig.employees);
                //Show the data after its loaded
                update_employeeData(ffConfig.employees);
           });

    }

     //Load employee data
    this.load = function() {

       load_employeeData( ffConfig.api.employees,function() {
            //Show the data after its loaded
            update_employeeData(ffConfig.employees);
       });

    }

    var load_localEmployee = function() {
            //URL to call for employee data
            var load_url = ffConfig.api.employee + "?access_token="+ffConfig.api.token;

           xLoader.get(load_url,function(data) {
                console.log(JSON.stringify(data));
                ffConfig.local_employee = new FirmafonEmployee(null,data.employee);

                console.log( "Local: " + ffConfig.local_employee.name() );
           });

        }

    var load_employeeData = function(url,callback) {

        //Send request
       xLoader.get(url,function(data) {

            //Test if data is correct
            //on error user is returned to login
            if ( !error(data) ) {
                 //Get next employee
                 for (var i=0; i<data.employees.length; i++) {

                        //Create employee object (row_num,employee)
                        var emp = new FirmafonEmployee(i,data.employees[i]);

                        //Add to employee list
                        ffConfig.employees[i] = emp;

                    }//ENd for

                   try { callback(); }
                   catch(e) {}
            }//ENd error

       });//ENd xLoader
    }

    //Loads the employees data container to layout
    var load_employeeContainers = function(employees) {
        var out = "";//What to display

        //Get next employee
        for (var i=0; i<employees.length; i++) {
            var employee = employees[i];

            out += employee.template();
        }//ENd for

        //Show out in employee_list container
        $( output_id ).html( out );
    }

    //Loads the employees list to layout
    var update_employeeData = function(employees) {
        var out = "";//What to display

        //Get next employee
        for (var i=0; i<employees.length; i++) {
            var employee = employees[i];

            employee.update();
        }//ENd for

    }

    //Test if return data from firmafon is error data
    //if error is found, return user to login display
    //{"readyState":4,"responseText":"{\"status\":\"failure\",\"message\":\"401 Unauthorized\"}","responseJSON":{"status":"failure","message":"401 Unauthorized"},"status":401,"statusText":"error"}
    var error = function(data) {
        var out;

        //If data has status and is 401 = error
        if (data.status === 401) {
            console.log(">>"+data.status);
            //Reset access token
            jFirmafon.reset_auth();
            //Load auth page
            //jSystem.load("firmafon_auth.html");

            out = true;
        }
        //If no error do callback
        else {
            out = false;
        }

        return out;
    }
}

var FirmafonEmployee__ = function(row,e) {

    var row_id = row;
    var employee = e;

    this.is_localEmployee = function() {
        return (ffConfig.local_employee.id() === this.id());
    }

    this.name = function() {
        return employee.name;
    }

    this.row = function() {
        return row_id;
    }

    this.id = function() {
        return employee.id;
    }

    this.number = function() {
        return employee.number;
    }

    this.presence = function() {
        return employee.live_presence;
    }

    this.available = function() {
        return ( (this.presence() == "available") || (this.presence() == "unknown") );
    }

    this.speed_dial = function() {
        return employee.speed_dial;
    }

    this.dial = function() {
        //return "<a href=\"javascript:dial("+this.number()+");\">Call</a>";
        firmafon.dial( this.number() );
    }

    this.template = function() {
        var tpl = "<div style=\"width:100%;\" id=\"emp"+this.id()+"\"></div>";
        return tpl;
    }

    this.localEmployee_template = function() {

        //Layout
        var table = "<table class=\"employee\">"+
                        "<tr>" +
                            "<td class=\"presence "+this.presence()+"\"></td>"+
                            "<td class=\"name\">"+this.name()+"</td>"+
                        "</tr>"+
                    "</table>";

        return table;
    }

    this.update = function() {
         //Make link to call employee

         var dial_lnk;
         if (this.available()) {
            dial_lnk = "<a href=\"javascript:firmafon.employee("+this.row()+").dial()\"><button class=\"call-btn "+this.presence()+"\">Call</button></a>";
         }
         else { dial_lnk = "<button class=\"call-btn "+this.presence()+"\">Call</button>"; }

        //Layout
        var table = "<table class=\"employee\">"+
                        "<tr>" +
                            "<td class=\"call\">"+dial_lnk+"</td>"+
                            "<td class=\"name\">"+this.name()+"</td>"+
                        "</tr>"+
                    "</table>";


            if (this.is_localEmployee()) {
                $("#local_employee").html( this.localEmployee_template() );
                jNotify.icon( this.presence() );

                notify( this.presence() );
            }
            $("#emp"+this.id()).html( table );
    }

    var notify = function(presence) {
        if (presence == "ringing") {
            jNotify.message("Incomming Call");
        }
        else {
            //jNotify.message(presence);
        }
    }
}

var firmafon = new FirmafonHandler();

firmafon.add_Loader( new Firmafon_EmployeesLoader("#employee_list") );
firmafon.preloader(function() {
    firmafon.loader();
});
