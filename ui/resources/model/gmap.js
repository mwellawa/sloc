window.addEventListener('load', function() {
	var script = document.createElement('script');
	// script.setAttribute("id", "mapsScript");
	// script.type = "text/javascript";
	script.setAttribute("async", "");
	script.setAttribute("defer", "");
	script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCiZNyjfAv-gRYK9TuZQQFk3zb6VoBg3J0&callback=initMap";
	// $('#mapsScript').attr('async');
	// $('#mapsScript').attr('defer');
	document.body.appendChild(script);
});

function initMap() {
	var latlng = new google.maps.LatLng(39.305, -76.617);
	var map = new google.maps.Map(document.getElementById('__xmlview0--gmaps1'), {
		center: latlng,
		zoom: 12
	});	
	console.log("init map called....");
}