var FirmafonEmployee = function(row,e) {

    var row_id = row;
    var employee = e;

    this.in_transfer = false;

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
        return ( (this.presence() == "available") || (this.presence() == "unknown") || (this.in_transfer == false));
    }

    this.speed_dial = function() {
        return employee.speed_dial;
    }

    this.dial = function() {
        callHandler.dial( this.number() );
        //ffCalls.dial( this.number() );
    }

    this.transfer = function() {
        callHandler.call_Transfer( this.id(),function() {
            this.in_transfer = true;
            $(this.template_id() + " .transfer").html(this.transfer_btn()).show();
        });
    }

    this.hangup = function() {
        callHandler.call_Hangup( function() {
            this.in_transfer = false;
            $(".transfer").hide();
        });
        //ff2Calls.call_Hangup( );
    }

    this.template_id = function() {
        return "emp"+this.id();
    }

    this.template_container = function() {
        var tpl = "<div style=\"width:100%;\" id=\""+this.template_id()+"\"></div>";
        return tpl;
    }

    this.template_localEmployee = function() {
        var emp = Firmafon.employees().get_LocalEmployee();
        console.log("Local Presence: "+ emp.get("presence") );

        jSystem.setWindowTitle( this.name() + " - " + this.presence() );

        //Layout
        var table = "<table class=\"employee\">"+
                        "<tr>" +
                            "<td class=\"presence "+this.presence()+"\">"+dnd_button(this.presence())+"</td>"+
                            "<td>" +
                            "<a href=\"javascript:jSystem.exit_application()\">"+
                                  "<button class=\"call-btn busy\">Exit</button>"+
                             "</a>"+
                            "</td>"+
                        "</tr>"+
                    "</table>";

        $("#local_employee").html( table );

        return table;
    }

    this.call_btn = function() {
         var dial_link;
         if (this.available()) { dial_link = "<a href=\"javascript:firmafon.employee("+this.row()+").dial()\"><button class=\"call-btn "+this.presence()+"\">Call</button></a>"; }
         else { dial_link = "<button class=\"call-btn "+this.presence()+"\">Call</button>"; }

         return dial_link;
    }

    this.transfer_btn = function() {
        var transfer_link = "<a href=\"javascript:firmafon.employee("+this.row()+").transfer()\"><button class=\"call-btn available\">Transfer</button></a>";
        var hangup_link = "<a href=\"javascript:firmafon.employee("+this.row()+").hangup()\"><button class=\"call-btn available\">Hangup</button></a>";
        var out = "";

         if (this.in_transfer == true) { out = hangup_link; }
         else { out = transfer_link; }

         return out;
    }

    this.update = function() {
         //Make link to call employee

         var transfer_link = "<a href=\"javascript:firmafon.employee("+this.row()+").transfer()\"><button class=\"call-btn available\">Transfer</button></a>";
         var hangup_link = "<a href=\"javascript:firmafon.employee("+this.row()+").hangup()\"><button class=\"call-btn available\">Hangup</button></a>";

        //Layout
        var table = "<table class=\"employee\">"+
                        "<tr>" +
                            "<td class=\"call\">" + this.call_btn() + "</td>"+
                            "<td class=\"transfer hide\">"+this.transfer_btn()+"</td>"+
                            "<td class=\"name\">"+this.name()+"</td>"+
                        "</tr>"+
                    "</table>";


            if (this.is_localEmployee()) {
                this.template_localEmployee();

                this.call_DataTemplate(this.presence(),this.number());
                firmafon.notify( this.presence() );
            }

            $("#emp"+this.id()).html( table );
    }

    this.call_DataTemplate = function(presence,number) {
        //if ((presence == "ringing") || (presence == "busy")) {

            callHandler.call_Active(number,presence,function(data) {

                if (data != null) {
                    var cd = "Call from: " + data.from_number();

                    firmafon.notify(presence, cd);
                    $("#active_call").html(cd).show();

                    if ( data.direction() == "incoming" ) { $(".transfer" ).show(); }
                }
                else {
                    $("#active_call").html("").hide();
                    $(".transfer").hide();
                    this.in_transfer = false;
                }

            });

        //} else { $("#active_call").html("").hide(); }
    }

    var dnd_button = function(presence) {
        if (presence == "do_not_disturb") {
            return "<input type=\"checkbox\" title=\"Turn Do not disturb OFF\" onclick=\"firmafon.dnd(false)\" checked />";
        }
        else {
            return "<input type=\"checkbox\" title=\"Turn Do not disturb ON\" onclick=\"firmafon.dnd(true)\" />";
        }
    }


}