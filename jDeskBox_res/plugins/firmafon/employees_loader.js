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

                var id = ffConfig.local_employee.id();
                var employee = Firmafon.new_LocalEmployee(id);

                employee.add_value("name",ffConfig.local_employee.name());
                employee.add_value("number",ffConfig.local_employee.number());
                employee.add_value("presence",ffConfig.local_employee.presence());
                Firmafon.update_Employee(employee);

                console.log( "Local: " + ffConfig.local_employee.name() );

                firmafon.notify("available","Welcome "+ffConfig.local_employee.name());
           });

        }

    var load_employeeData = function(url,callback) {

        //Send request
       xLoader.get(url,function(data) {

            //Test if data is correct
            //on error user is returned to login
            if ( !error(data) ) {
                 var count=0;

                 //Get next employee
                 for (var i=0; i<data.employees.length; i++) {
                        var item = data.employees[i];

                        //Create temp employee object
                        var tmp = new FirmafonEmployee(0,item);

                        //If employee data is not excluded(no number or name in exclude list)
                        if (!firmafon.is_Excluded(tmp)) {
                            //Make employee
                            var employee = Firmafon.new_Employee(item.id);

                            var emp = new FirmafonEmployee(count,item);

                            employee.add_value("name",emp.name());
                            employee.add_value("number",emp.number());
                            employee.add_value("presence",emp.presence());
                            Firmafon.update_Employee(employee);

                            //Add employee in list
                            ffConfig.employees[count] = emp;
                            //Add to row count
                            count++;
                        }

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

            out += employee.template_container();
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