/* Get Output */
function getOutput(result) {
	var output = {
		returnCode: 0,
		message: ""
	};
	if (result.EX_ERROR === null) {
		output.returnCode = 0;
		return output;
	} else {
		output.returnCode = 9;
		output.message = result.EX_ERROR;
		return output;
	}
}

/* Create Postcode */
function createPostcode(postcode, conn) {
	var fnPostcode = conn.loadProcedure("sloc.db::fetchPostcode");
	var result = fnPostcode({
		IM_POSTCODE: postcode.postcode,
		IM_STATE: postcode.state,
		IM_FETCH_ONLY: false
	});
	conn.commit();
	return getOutput(result);
}

/* Create Suburb */
function createSuburb(suburb, conn){
	var fnSuburb = conn.loadProcedure("sloc.db::fetchSuburb");
	var result = fnSuburb({
		IM_POSTCODE: suburb.postcode,
		IM_SUBURB: suburb.suburb,
		IM_FETCH_ONLY: false
	});
	conn.commit();
	return getOutput(result);
}

/* Create Address */
function createAddress(address, conn){
	var fnAddress = conn.loadProcedure("sloc.db::addAddress");
	var result = fnAddress({
		IM_LEVEL: address.level,
		IM_BUILDING: address.building,
		IM_STREETNO: address.streetNo,
		IM_STREET: address.street
	});
	conn.commit();
	return getOutput(result);
}

/* Data Construct */
var postcode = {
	postcode: $.request.parameters.get("postcode"),
	state: $.request.parameters.get("state")
};
var suburb = {
	suburb: $.request.parameters.get("suburb"),
	postcode: $.request.parameters.get("postcode")
};
var address = {
	level: $.request.parameters.get("level"),
	building: $.request.parameters.get("building"),
	streetNo: $.request.parameters.get("streetno"),
	street: $.request.parameters.get("street")
};

// validate the inputs here!
var conn = $.hdb.getConnection();
createPostcode(postcode, conn);
createSuburb(suburb, conn);
createAddress(address, conn);

conn.close();

$.response.contentType = "application/json";
$.response.setBody(output);