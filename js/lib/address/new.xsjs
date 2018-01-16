function saveStoreAddress(data) {
	
	var conn = $.hdb.getConnection();
	
	//check if postcode exists
	var fcTest = conn.loadProcedure("sloc.db.procedures::test1");
	var result = fcTest({
		IM_INCOMING: data.val1
	});
	conn.commit();
	conn.close();
	
	console.log(result);	
	
}
var data = {
	val1: $.request.parameters.get("val1")
};

// validate the inputs here!
saveStoreAddress(data);
$.response.contentType = "application/json";
$.response.setBody('Done!');