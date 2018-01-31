sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("slocui.controller.Main", {

		onInit: function () {
			var oModel = new sap.ui.model.odata.ODataModel("odata/services/storeloc.xsodata", true);
			this.getView().setModel(oModel);
			jQuery.sap.require("slocui/model/gmap");
			//var slist = this.getView().byId("storesList");
		}

	});
});