function saveStoreAddress(addr) {
	
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(addr);
	
	//check if postcode exists
	var fnCreateStoreAddr = conn.loadProcedure("sloc.db.procedures::getPostcode");
	var result = fnCreateStoreAddr({
		im_postcode: '3016',
		im_state: 'VIC'
	});
	conn.commit();
	conn.close();
	
	//if postcode does not exist create postcode
	if (result.ex_postcode !== addr.postcode) {
		output = 'postcode invalid : ' + addr.postcode;
	}
	return output;
}
var addr = {
	state: $.request.parameters.get("state"),
	postcode: $.request.parameters.get("postcode")
};

// validate the inputs here!
var output = saveStoreAddress(addr);
$.response.contentType = "application/json";
$.response.setBody(output);