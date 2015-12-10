//(function () {

    var geocoder;
    var map;
    var rangePoints = [];
    var rangePolygon;
    var markers = [];
    var isLocationSet = false;
    var checkPoints = [];
    var checkPointMarkers = [];
    var bounds = [];


    function initialize() {
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(37.45, -122.15);
        var mapOptions = {
            zoom: 11,
            center: latlng
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        google.maps.event.addListener(map, 'rightclick', function (event) {
            if (isLocationSet) {
                placeCheckPoints(event.latLng);
            } else {
                placeRangePoints(event.latLng);
            }
        });
    }

    function placeRangePoints(location) {
        if (!rangePolygon) {
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
            rangePoints.push(location);
            markers.push(marker);
        }
    }

    function placeCheckPoints(location) {
        if (google.maps.geometry.poly.containsLocation(location, rangePolygon)) {
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
            checkPoints.push(location);
            checkPointMarkers.push(marker);
        }
    }

    function setRangePolygon() {
        rangePolygon = new google.maps.Polygon({
            paths: rangePoints,
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0000FF',
            fillOpacity: 0.30,
            clickable: false
        });
        rangePolygon.setMap(map);
        markers.forEach(function (maker) {
            maker.setMap(null);
        });
        markers = [];
    };

    function codeAddress() {
        var address = document.getElementById('address').value;
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                bounds = results[0].geometry.viewport;
                map.fitBounds(bounds);
                document.getElementById('address').value = results[0].formatted_address;
                console.log(results);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function setLocation() {
        if (!rangePolygon) {
            setRangePolygon();
            document.getElementById('location').value = rangePoints.toString();
            isLocationSet = true;
        }
    }


    function setCheckPoints() {
        if (checkPoints.length > 0) {
            document.getElementById('checkpoints').value = checkPoints.toString();
        }
    }

    function clearLocation() {
        document.getElementById('location').value = null;
        if (rangePolygon) {
            rangePolygon.setMap(null);
        }
        markers.forEach(function (maker) {
            maker.setMap(null);
        });
        markers = [];
        rangePoints = [];
        rangePolygon = null;
        isLocationSet = false;
    }

    function clearCheckPoints() {
        document.getElementById('checkpoints').value = null;
        checkPointMarkers.forEach(function (maker) {
            maker.setMap(null);
        });
        checkPointMarkers = [];
        checkPoints = [];
    }

    google.maps.event.addDomListener(window, 'load', initialize);

//})();