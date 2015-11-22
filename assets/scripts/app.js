var $button = $('button');
$button.on('click', function(event) {
  event.preventDefault();
  var $cityInput = $('#city');
  var city = $cityInput.val();
  var $stateInput = $('#state');
  var state = $stateInput.val();
  getLatLong(city, state);
  getList(city, state);
});

// Google maps api key = AIzaSyAu9tqAfwr9y_b4MUrI_Sg8iMbfIDe24Z0
var lat, long;
var coordArr = [];

function getLatLong(city, state) {
  var google = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&components=administrative_area:' + state + '&key=AIzaSyAu9tqAfwr9y_b4MUrI_Sg8iMbfIDe24Z0';
  $.get(google, function(object) {
    lat = object.results[0].geometry.location.lat;
    long = object.results[0].geometry.location.lng;
  });
}

function getList(city, state) {
  //URL Encoding
  // %3D is =
  // %3A is :
  // %2F is /
  // + is space
  // %26 is &
  var search = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Flocations%3Fkey%3D0d28b6999d59c70e170fb29165a647d2%26locality%3D' + city + '%26region%3D' + state;
  $.get(search, function(object) {
    var brewArr = object.data;
    listing(brewArr);
  });
}

function listing(arr) {
  var $list = $('.brew-list');
  $list.empty();
  var length = arr.length;
  for (var i = 0; i < length; i++) {
    var brewNames = arr[i].brewery.name;
    var type = arr[i].locationTypeDisplay;
    var address = arr[i].streetAddress;
    var zip = arr[i].postalCode;
    $list.append($('<li>').text(brewNames + ', ' + type + ', ' + address + ' ' + zip));
    var brewLat = arr[i].latitude;
    var brewLong = arr[i].longitude;
    var mapInfo = [{lat: brewLat, lng: brewLong}, brewNames];
    coordArr.push(mapInfo);
  }
  showMap(lat, long, coordArr);
}

function showMap(lat, long, arr) {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(lat, long),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var length = arr.length;
  for (var j = 0; j < length; j++) {
    var marker = new google.maps.Marker({
      position: arr[j][0],
      map: map,
      animation: google.maps.Animation.DROP,
      title: arr[j][1]
    });
  }
}
