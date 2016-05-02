var CRMStores = function(d) {
    var data = JSON.parse( d );

    this.show = function() {
        var s = "";
        for (var i=0; i<data.length; i++) {
            s += store( data[i].store );
        }

        jSystem.log( data[0].store.store_id );
        $("body").html(s);
    }

    var store = function(item) {
        jSystem.log(item);
        var out = "";
        out += "Store: <a href=\"javascript:jSystem.exec('mstsc c:/Shortcuts/Playground.rdp')\">" + item.store_id + "</a><br>";

        return out;
    }

}