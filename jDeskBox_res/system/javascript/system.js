var javaReady = function(callback){
    if(typeof callback =='function'){
        if(typeof java !='undefined'){
            callback();
        } else {
            var javaTimeout = 0;
            var readycall = setInterval(function(){
            javaTimeout++;
                if(typeof java !='undefined' || javaTimeout > 1000){
                    try{
                        callback();
                    } catch(s){};
                    clearInterval(readycall);
                }
            },1);
        }
    }
};

var errorlistener = function(msg, url, line){
javaReady(function(){
jSystem.log(msg +", url: "+url+ ", line:" + line);
});
};

//overide onerror
var onerror = errorlistener;


var systemReady = function() {
    this.ready = function() {
        return (System != "undefined");
    }
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}