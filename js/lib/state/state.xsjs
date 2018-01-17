function createState(state) {
	var conn = $.hdb.getConnection();
	var output = JSON.stringify(state);
	var fnCreateState = conn.loadProcedure("sloc.db::createState");
	var result = fnCreateState({
		IM_STATE: state.state,
		IM_STATENAME: state.name
	});
	conn.commit();
	conn.close();
	if (result.EX_ERROR === null) {
		return output;
	} else {
		return result.EX_ERROR;
	}
}

var state = {
	state: $.request.parameters.get("state"),
	name: $.request.parameters.get("name")
};

// validate the inputs here!
var output = createState(state);
$.response.contentType = "application/json";
$.response.setBody(output);