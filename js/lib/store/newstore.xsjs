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
function createState(state, conn) {
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
function createSuburb(suburb, conn) {
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
function createStreetAddress(streetAddress, conn) {
	var fnCreateStreetAddress = conn.loadProcedure("sloc.db::createSteetAddress");
	var result = fnCreateStreetAddress({
		IM_LEVEL: streetAddress.level,
		IM_BUILDING: streetAddress.building,
		IM_STREET_NO: streetAddress.streetNo,
		IM_STREET: streetAddress.street
	});
	conn.commit();
	return result.EX_KEY.toString();
}
/*************************************
 ----- Create Store Address					 
*************************************/
function createStoreAddress(storeAddress, conn) {
	var fnCreateStoreAddress = conn.loadProcedure("sloc.db::createStoreAddress");
	var result = fnCreateStoreAddress({
		IM_STORE_ID: storeAddress.storeId,
		IM_STREET_ID: storeAddress.streetId,
		IM_SUBURB: storeAddress.suburb,
		IM_POSTCODE: storeAddress.postcode,
		IM_STATE: storeAddress.state,
		IM_REMARKS: storeAddress.remarks,
		IM_LOGITUDE: storeAddress.longitude,
		IM_LATITUDE: storeAddress.latitude
	});
	conn.commit();
	return getOutput(result);
}
/*************************************
 ----- Create Store					 
*************************************/
function createStore(store, conn) {
	var fnCreateStore = conn.loadProcedure("sloc.db::fetchStore");
	var result = fnCreateStore({
		IM_COMPANY_CODE: store.companyCode,
		IM_STORE_ID: store.id,
		IM_STORE_NAME: store.name,
		IM_CREATE: true
	});
	conn.commit();
	return getOutput(result);
}
/*************************************
 ----- Create Company					 
*************************************/
function createCompany(company, conn) {
	var fnCreateCompany = conn.loadProcedure("sloc.db::fetchCompany");
	var result = fnCreateCompany({
		IM_COMPANY_CODE: company.companyCode,
		IM_COMPANY_NAME: company.companyName,
		IM_CREATE: true
	});
	conn.commit();
	return getOutput(result);
}
/*************************************
 ----- Create Store with Address					 
*************************************/
function createNewStore(newstore, conn) {

	var state = {
		"state": newstore.state.state,
		"state_name": newstore.state.state_name
	};
	createState(state, conn);

	var postcode = {
		"postcode": newstore.postcode,
		"state": newstore.state.state
	};
	createPostcode(postcode, conn);

	var suburb = {
		"suburb": newstore.suburb,
		"postcode": newstore.postcode
	};
	createSuburb(suburb, conn);

	var company = {
		"companyCode": newstore.company.company_code,
		"companyName": newstore.company.company_name
	};
	createCompany(company, conn);

	var store = {
		"companyCode": newstore.company.company_code,
		"id": newstore.store.id,
		"name": newstore.store.store_name
	};
	createStore(store, conn);

	var streetAddresss = {
		"level": newstore.street.level,
		"building": newstore.street.building,
		"streetNo": newstore.street.streetNo,
		"street": newstore.street.streetName
	};
	var streetId = createStreetAddress(streetAddresss, conn);

	var storeAddress = {
		"storeId": newstore.store.id,
		"streetId": streetId,
		"suburb": newstore.suburb,
		"postcode": newstore.postcode,
		"state": newstore.state.state,
		"remarks": newstore.store.remarks,
		"longitude": newstore.store.geolocation.longitude,
		"latitude": newstore.store.geolocation.latitude
	};
	createStoreAddress(storeAddress, conn);
}

function mapNewStore(record) {

	var newstore = {
		state: {
			state: "",
			state_name: ""
		},
		postcode: "",
		suburb: "",
		street: {
			streetName: "",
			streetNo: "",
			building: "",
			level: ""
		},
		company: {
			company_code: "ABCGRP",
			company_name: "ABC Group"
		},
		store: {
			store_name: "",
			geolocation: {
				longitude: "",
				latitude: ""
			},
			remarks: ""
		}
	};


	newstore.state.state = record.state;
	newstore.state.state_name = "";
	newstore.postcode = record.zip_code.toString();
	newstore.suburb = record.city;
	newstore.company.company_code = "OW";
	newstore.company.company_name = "Officeworks";
	newstore.store.id = record.id;
	newstore.store.store_name = record.name;
	newstore.store.remarks = record.full_address;
	newstore.street.level = "";
	newstore.street.building = "";
	newstore.street.streetNo = "";
	newstore.street.streetName = record.address;
	newstore.store.geolocation.longitude = record.longitude;
	newstore.store.geolocation.latitude = record.latitude;
	
	return newstore;
}

function start(data) {
	var conn = $.hdb.getConnection();
	for (var i = 0; i < data.length; i++) {
		var newStore = mapNewStore(data[i]);
		//var newStore = data.storeData[i];
		createNewStore(newStore, conn);
	}
	conn.close();
}

var body = $.request.body.asString();
var data = JSON.parse(body);
start(data);
$.response.contentType = "application/text";
$.response.setBody("Process Complete!");

/* JSON Body
{
  "storeData": [
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
          "longitude": "145.385059",
          "latitude": "-37.768459"
        },
        "remarks": "this is a test record"
      }
    },
    {
      "state": {
        "state": "VIC",
        "state_name": "Victoria"
      },
      "postcode": 3136,
      "suburb": "CROYDON",
      "street": {
        "streetName": "some street 999",
        "streetNo": "258",
        "building": "4",
        "level": "1st Floor"
      },
      "company": {
        "company_code": "ABCGRP",
        "company_name": "ABC Group"
      },
      "store": {
        "store_name": "W999",
        "geolocation": {
          "longitude": "145.385059",
          "latitude": "-37.768459"
        },
        "remarks": "this is a test record"
      }
    }
  ]
}
*/