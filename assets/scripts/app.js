
// Google maps api key = AIzaSyAu9tqAfwr9y_b4MUrI_Sg8iMbfIDe24Z0

var lat, long, coordArr, info;
var markers = [];

var $beerMe = $('button');
$beerMe.on('click', function(event) {
  event.preventDefault();
  var $cityInput = $('#city');
  var city = $cityInput.val();
  var $stateInput = $('#state');
  var state = $stateInput.val();
  coordArr = [];
  getLatLong(city, state);
  getList(city, state);
});

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
    // console.log(object);
    var brewArr = object.data;
    listing(brewArr);
  });
}

function listing(arr) {
  var $total = $('.brew-total');
  $total.empty();
  var $list = $('.brew-list');
  $list.empty();
  var length = arr.length;
  $total.append($('<h4>').text('Listings (' + length + ')'));
  for (var i = 0; i < length; i++) {
    var brewNames = arr[i].brewery.name;
    var brewID = arr[i].breweryId;
    var type = arr[i].locationTypeDisplay;
    var address = arr[i].streetAddress;
    var zip = arr[i].postalCode;
    var phone = arr[i].phone;
    $list.append($('<hr>'));
    $list.append($('<h3>').text(brewNames));
    $list.append($('<h5>').text(type));
    $list.append($('<p>').html(address + ' ' + zip + '<br/>' + phone));
    var brewLat = arr[i].latitude;
    var brewLong = arr[i].longitude;
    var mapInfo = [{lat: brewLat, lng: brewLong}, brewNames];
    coordArr.push(mapInfo);
  }
  showMap(lat, long);
}

function showMap(lat, long) {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(lat, long),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(mapCanvas, mapOptions);
  info = new google.maps.InfoWindow();
  drop(coordArr);
}

function drop(arr) {
  var length = arr.length;
  for (var i = 0; i < length; i++) {
    addMarkerWithTimeout(arr[i][0], arr[i][1], i * 75);
  }
}

function addMarkerWithTimeout(position, title, timeout) {
  window.setTimeout(function() {
    var spot = new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      title: title
    });
    spot.addListener('click', function() {
      info.setContent(title);
      info.open(map, spot);
    });
    markers.push(spot);
  }, timeout);
}
