var CallHandler = function() {


     /** Dial a number
         * @param number int
         */
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

    this.call_Active = function(number,callback) {
        var url = ffConfig.api.calls+"?access_token="+ffConfig.api.token+"&direction=incoming&number="+number+"&limit=1";

        xLoader.get(url,function(data) {
            try {
                console.log( JSON.stringify(data) );
                if (data.calls.length > 0) {
                    callback(data);
                }

            }
            catch(e) {}
        });
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

    /** Dial a number
             * @param number int
             */
    this.call_hangup = function(call_uuid) {
        var url_hangup = ffConfig.api.nodes + ffConfig.cfg.node_uuid + "/hangup";
        console.log("Transfer>> " + url_hangup);

        var transf = {endpoint:"Employee#"+employee_id,type:"unattended",access_token:ffConfig.api.token};

        /**** WARNING WILL TRANSFER CALL! ***/
        if (ffConfig.cfg.callsActivated) {
            xLoader.post(url_transfer,transf,function(data) {
                console.log("Transfer result: "+data);

                ffCalls.call_Active(number,function(data) {
                    var nodes = data.calls[0].nodes;
                    var call = data.calls[0];

/*
                    xLoader.post(url_hangup,"",function(data) {
                        console.log("Hangup result: "+data);
                    });
                    */
                });

            });

        }
        /******/

    }

}