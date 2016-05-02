/** Modify jQuery with a $.put(url,callback) & $.delete(url,callback)
 **/
jQuery.each( [ "put", "delete" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});



/** Does calls to a selected file throug ajax with jquery
*
*
**/

var AJAXLoader = function() {
	console.log("AJAXLoader(xLoader) by: Søren Pedersen");

	var error = function(err) {
		console.log(err);
	}
	
	var query_get = function(url_values,callback) {
		console.log("Query_get");
		
		$.ajax({
			   url: url_values,
			   data: {
			      format: 'json'
			   },
			   error: function(e) {
			      error(e);
			   },
			   dataType: 'jsonp',
			   complete: function(data) {
			      jSystem.log("Success! Starting callback");
				   callback( data );
			   },
			   type: 'GET'
			});		
	}

    var query_post = function(url,values,callback) {
        console.log("Query_post");

        $.ajax({
               url: url,
               type: 'POST',
               data: values,
               error: function(e) {
                  console.log("Error! " + JSON.stringify(e));
               },
               complete: function(data) {
                  console.log("Success! Starting callback " + JSON.stringify(data));
                   callback( data );
               }
            });
    }

     var query_put = function(url,values,callback) {
        console.log("Query_put");
        console.log("Values "+values);

        $.ajax({
               url: url,
               type: 'PUT',
               data: values,
               error: function(e) {
                  console.log("Error! " + JSON.stringify(e));
               },
               complete: function(data) {
                  console.log("Success! Starting callback " + JSON.stringify(data));
                   callback( data );
               }
            });
    }

	this.json = function(url_values,callback) {
		query_get( url_values,callback );
	}

	this.get = function(url_values,callback) {
        console.log("xLoader(get)>> "+url_values);

        $.get(url_values,function(data) {
            console.log("xLoader>> Success "+data);

            callback(data);
        }).fail(function(data) {
            console.log("xLoader>> "+url_values);

              callback(data);
           });
    }

    this.post = function(url,values,callback) {
        query_post(url,values,callback);
    }

	this.put = function(url,values,callback) {

        query_put(url,values,callback);
        /**
	    $.put(url,values,function(data) {
	        console.log("xLoader(put)>> "+url+":"+values);
	        callback(data);
	    },"PUT");
	    **/
	}
}
var xLoader = new AJAXLoader();