var active_call = null;

var Firmafon_CallHandler = function() {

    var url_call_data = ffConfig.api.calls+"?access_token="+ffConfig.api.token+"&direction=incoming&limit=1&number=";

    var activeStates = ["ringing","busy"];

    //Tests if presence is in active state
    var is_Active = function(presence) {
        var out = false;

        for (var i=0; i<activeStates.length; i++) {
            if (activeStates[i] == presence) { out = true; }
        }

        return out;
    }

    /** Returns active call data
     * or null if no call is active
     * @param number int Phone number
     * @param presence string Users presence
     * @param callback function
    **/
    this.call_Active = function(number,presence,callback) {

        //If call is active
        if (is_Active(presence)) {
            //Load users call data
            get_CallData(url_call_data+number,function() {
                //Return data
                callback(active_call);
            });

        }
        else {
            //Return null if no call is active
            callback(null);
        }

    }


    /** Transfers call from local user to employee_id
     *
     *
    **/
    this.call_Transfer = function(employee_id,callback) {
        var url_transfer = ffConfig.api.nodes + active_call.node_uuid() + "/transfer";

        console.log("Transfer>> "+url_transfer);

        var tdata = {endpoint:"Employee#"+employee_id,type:"attended",access_token:ffConfig.api.token};

        /**** WARNING WILL TRANSFER CALL! ***/
        if (ffConfig.cfg.callsActivated) {
            xLoader.post(url_transfer,tdata,function(data) {
                console.log("Transfer result: "+ JSON.stringify( data ) );

                get_CallData( url_call_data );

                try { callback(); }
                catch(e) {}
            });

        }
    }

    /** Hangs up the call to finish the transfer
     *
    **/
    this.call_Hangup = function(callback) {
        var url_hangup = ffConfig.api.nodes + call_data.node_uuid() + "/hangup";

        var id = {id:active_call.call_uuid(), access_token:ffConfig.api.token};

        xLoader.post(url_hangup,id,function(data) {
            console.log(  JSON.stringify(data) );

            try { callback(); }
            catch(e) {}
        });
    }

     /** Dial a number
      * @param number int
     **/
    this.dial = function(number) {
        var url = ffConfig.api.dial +"?"+ffConfig.api.token+ "&to_number="+number;
        console.log("Dial>> "+url);

        /**** WARNING WILL MAKE CALL! ***/
        if (ffConfig.cfg.callsActivated) {

            xLoader.post(ffConfig.api.dial,"to_number="+number,function(data) {
                console.log("Dial result: "+data);
            });

        }

    }


    var get_CallData = function(url,callback) {

        xLoader.get(url,function(data) {

            if (data.calls.length > 0) {
                console.log( "Active Call: " +  JSON.stringify(data) );

                active_call = new CallData(data);
                active_call.show_NodeData();

            }
            else {
                active_call = null;
            }

            try { callback(); }
            catch(e) {}
        });

    }

}

var CallData = function(data) {
    var call_uuid = data.calls[0].call_uuid;
    var call_data = data.calls[0];

    this.call_uuid = function() {
        return call_uuid;
    }

    this.from_number = function() {
        return call_data.from_number_formatted;
    }

    this.direction = function() {
        return call_data.direction
    }

    /** Returns the latest node uuid
     *
    */
    this.node_uuid = function() {
        return call_data.nodes[0].node_uuid;
    }

    this.show_NodeData = function() {

        for (var i=0; i<call_data.nodes.length; i++) {
            console.log( JSON.stringify(call_data.nodes[i]) );
        }

    }
}