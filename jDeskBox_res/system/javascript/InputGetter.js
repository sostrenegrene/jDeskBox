var InputGetter = function() {
	console.log("InputGetter(inget) by: Søren Pedersen");

	this.keyUp = function(id,callback) {
		$(id).keyup(function() {
			var val = $(this).val();
			callback(val);
		});
	}
	
	this.submit1 = function(click_id,form_id,callback) {
		$(id).click(function() {
			var val = $(form_id).serialize();
			callback(val);
		});
	}

	this.submit = function(form_id,callback) {
        $(form_id).submit(function() {
            var val = $(this).serialize();
            callback(val);

            return false;
        });
    }
	
	this.confirm = function(text,url) {
		if (confirm(text) == true) {
	        location.href = url;
	    } 
	}
	
}
var inget = new InputGetter();