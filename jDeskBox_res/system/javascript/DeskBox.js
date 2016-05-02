var cfg = {};

var DeskBox_Main = function() {
    this.config = {};

    this.include = function(script) {
        $.getScript(script);
    }

    this.ready = function( callback ) {
            alert("Waiting for Java Interfaces");
            interval = setInterval(function() {
                isReady(callback);
            },50);
    }

    var isReady = function(callback) {
        var out = false;

        try {
            jSystem.getAppName();
            out = true;
            jSystem.log("Java Interfaces ready");
            clearInterval(interval);
            callback();
        }
        catch(err) {
            alert( err.message );

            out = false;
        }

        return out;
    }

}
var DeskBox = new DeskBox_Main();
