sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("slocui.controller.Main", {

		onInit: function() {
			var oModel = new sap.ui.model.odata.ODataModel("odata/services/storeloc.xsodata", true);
			var oView = this.getView();
			oView.setModel(oModel);
			this.oSF = oView.byId("searchField");
		},

		onAfterRendering: function() {
			var me = this;
			this.loadGoogleMaps("https://maps.googleapis.com/maps/api/js?key=AIzaSyCiZNyjfAv-gRYK9TuZQQFk3zb6VoBg3J0", me.setMapData.bind(me));
		},

		loadGoogleMaps: function(scriptUrl, callbackFn) {
			var script = document.createElement("script");
			script.onload = function() {
				callbackFn();
			};
			script.src = scriptUrl;
			document.body.appendChild(script);
		},

		// function to set map data
		setMapData: function() {
			var myCenter = new google.maps.LatLng(-25.344358, 131.036867);
			var mapProp = {
				center: myCenter,
				zoom: 4,
				scrollwheel: true,
				draggable: true
			};
			new google.maps.Map(this.getView().byId("gmaps1").getDomRef(), mapProp);
		},

		showStores: function(oCenterLoc, aStoreLoc) {

			var centerSuburb = new google.maps.LatLng(
				parseFloat(oCenterLoc.centerLat),
				parseFloat(oCenterLoc.centerLng)
			);
			var properties = {
				center: centerSuburb,
				zoom: 13,
				draggable: true
			};
			var map = new google.maps.Map(this.getView().byId("gmaps1").getDomRef(), properties);

			for (var i = 0; i < aStoreLoc.results.length; i++) {
				var storeMarkerLoc = new google.maps.LatLng(
					parseFloat(aStoreLoc.results[i].latitude),
					parseFloat(aStoreLoc.results[i].logitude)
				);
				var marker = new google.maps.Marker({
					position: storeMarkerLoc,
					animation: google.maps.Animation.DROP,
					map: map
				});
			}

		},

		onSearch: function(event) {
			var me = this;
			var oSource = event.getSource();
			oSource.suggest(false);
			var oCenterLoc = {};
			var item = event.getParameter("suggestionItem");
			if (item) {
				var sPath = "/LocRepo('" + item.getKey() + "')";
				var oModel = this.getView().getModel();
				oModel.read(sPath, {
					success: function(oData, oResponse) {
						oCenterLoc.centerLng = oData.longitude;
						oCenterLoc.centerLat = oData.latitude;
						sap.m.MessageToast.show("Nearest stores to " + oData.locality + " marked on map");
						var sStoreLocPath = "/StoreLocationParameters(in_longitude='" + oData.longitude + "',in_latitude='" + oData.latitude +
							"')/Results?$orderby=distance&$top=5";
						oModel.read(sStoreLocPath, {
							success: function(oData, oResponse) {
								me.showStores(oCenterLoc, oData);
							},
							error: function(oError) {
								sap.m.MessageToast.show("Error fetching stores" + oError);
							}
						});
					},
					error: function(oError) {
						sap.m.MessageToast.show("Error fetching coordinates" + oError);
					}
				});
			}
		},

		onSuggest: function(event) {
			var me = this;
			var oSF = me.oSF;
			var value = event.getParameter("suggestValue");
			var filters = [];
			if (value) {
				var filter = new Filter("locality", FilterOperator.StartsWith, value.toUpperCase());
				filters.push(filter);
			}
			var oBinding = me.oSF.getBinding("suggestionItems");
			oBinding.filter(filters);
			oBinding.attachEventOnce("dataReceived", function() {
				oSF.suggest();
			});
		}
		
	});
});