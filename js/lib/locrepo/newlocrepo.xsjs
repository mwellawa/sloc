/*************************************
 ----- Create Loc Repo Record					 
*************************************/
function createState(locrepo, conn) {
	var fnCreteLocRepo = conn.loadProcedure("sloc.db::createLocRepoRecord");
	var result = fnCreteLocRepo({
		IM_POSTCODE: locrepo.postcode,
		IM_LOCALITY: locrepo.locality,
		IM_STATE: locrepo.state,
		IM_LONGITUDE: locrepo.lng,
		IM_LATITUDE: locrepo.lat
	});
	conn.commit();
	return result.EX_KEY;
}

function start(data) {
	var conn = $.hdb.getConnection();
	var results = [];
	for (var i = 0; i < data.length; i++) {
		var newRec = {};
		var locrepo = {};
		locrepo.postcode = data[i].Pcode;
		locrepo.locality = data[i].Locality;
		locrepo.state = data[i].State;
		locrepo.lng = data[i].Longitude;
		locrepo.lat = data[i].Latitude;
		newRec.out = createState(locrepo,conn);
		newRec.in = locrepo;
		results.push(newRec); 
	}
	conn.close();
	return results;
}

var body = $.request.body.asString();
var data = JSON.parse(body);
var results = start(data);
$.response.contentType = "application/json";
body = JSON.stringify(results);
$.response.setBody(body);