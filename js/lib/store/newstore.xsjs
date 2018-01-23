/*************************************
 ----- Get Output					 
*************************************/
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
/*************************************
 ----- Create State					 
*************************************/
function createState(state, conn){
	var fnFetchPostcode = conn.loadProcedure("sloc.db::fetchState");
	var result = fnFetchPostcode({
		IM_STATE: state.state,
		IM_STATE_NAME: state.state_name,
		IM_CREATE: true
	});
	conn.commit();
	return getOutput(result);
}
/*************************************
 ----- Create Postcode					 
*************************************/
function createPostcode(postcode, conn) {
	var fnFetchPostcode = conn.loadProcedure("sloc.db::fetchPostcode");
	var result = fnFetchPostcode({
		IM_POSTCODE: postcode.postcode,
		IM_STATE: postcode.state,
		IM_CREATE: true
	});
	conn.commit();
	return getOutput(result);
}
/*************************************
 ----- Create Suburb					 
*************************************/
function createSuburb(suburb, conn){
	var fnFetchSuburb = conn.loadProcedure("sloc.db::fetchSuburb");
	var result = fnFetchSuburb({
		IM_SUBURB: suburb.suburb,
		IM_POSTCODE: suburb.postcode,
		IM_CREATE: true
	});
	conn.commit();
	return getOutput(result);
}
/*************************************
 ----- Create Street Address					 
*************************************/
function createStreetAddress(streetAddress, conn){
	var fnCreateStreetAddress = conn.loadProcedure("sloc.db::createSteetAddress");
	var result = fnCreateStreetAddress({
		IM_LEVEL: streetAddress.level,
		IM_BUILDING: streetAddress.building,
		IM_STREET_NO: streetAddress.streetNo,
		IM_STREET: streetAddress.street
	});
	conn.commit();
	return result.EX_KEY;
}
/*************************************
 ----- Create Store Address					 
*************************************/
function createStoreAddress(storeAddress, conn){
	var fnCreateStoreAddress = conn.loadProcedure("sloc.db::createStoreAddress");
	var result = fnCreateStoreAddress({
		IM_STORE_NAME: storeAddress.storeName,
		IM_STREET_ID: storeAddress.streetId,
		IM_SUBURB: storeAddress.suburb,
		IM_POSTCODE: storeAddress.postcode,
		IM_STATE: storeAddress.state,
		IM_REMARKS: storeAddress.remarks,
		IM_LOCATION: storeAddress.loc
	});
	conn.commit();
	return getOutput(result);
}
/*************************************
 ----- Data Construct					 
*************************************/
// var postcode = {
// 	postcode: $.request.parameters.get("postcode"),
// 	state: $.request.parameters.get("state")
// };
// var suburb = {
// 	suburb: $.request.parameters.get("suburb"),
// 	postcode: $.request.parameters.get("postcode")
// };
// var streetAddress = {
// 	level: $.request.parameters.get("level"),
// 	building: $.request.parameters.get("building"),
// 	streetNo: $.request.parameters.get("streetno"),
// 	street: $.request.parameters.get("street")
// };
// var storeAddress = {
// 	storeName: $.request.parameters.get("storeName"),
// 	streetId: "",
// 	suburb: $.request.parameters.get("suburb"),
// 	postcode: $.request.parameters.get("postcode"),
// 	state: $.request.parameters.get("state"),
// 	remarks: $.request.parameters.get("remarks"),
// 	loc: $.request.parameters.get("location")
// };


/* JSON Body
{
  "state": {
    "state": "VIC",
    "state_name": "Victoria"
  },
  "postcode": 3136,
  "suburb": "CROYDON",
  "street": {
    "streetName": "some street",
    "streetNo": "45",
    "building": "3",
    "level": "2nd Floor"
  },
  "company": {
    "company_code": "ABCGRP",
    "company_name": "ABC Group"
  },
  "store": {
    "store_name": "W999",
    "geolocation": {
      "longitude": 145.385059,
      "latitude": -37.768459
    },
    "remarks": "this is a test record"
  }
}
*/



/*************************************
 ----- Create Store with Address					 
*************************************/

var body = $.request.body.asString();
var newstore = JSON.parse(body);

var postcode = {
	"postcode": newstore.postcode,
	"state": newstore.state
};

var suburb = {
	"suburb": newstore.suburb,
	"postcode": newstore.postcode
};

var state = {
	"state": newstore.state.state,
	"state_name": newstore.state.state_name
};

var conn = $.hdb.getConnection();


createPostcode(postcode, conn);
createSuburb(suburb, conn);
createState(state, conn);

// var streetId = createStreetAddress(streetAddress, conn);
// storeAddress.storeAddress = streetId;
// createStoreAddress(storeAddress, conn);

// conn.close();

// $.response.contentType = "application/json";
// $.response.setBody(output);