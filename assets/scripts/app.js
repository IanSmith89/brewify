
// Google maps api key = AIzaSyAu9tqAfwr9y_b4MUrI_Sg8iMbfIDe24Z0

var lat, long, coordArr, info, printArr, beerArr;
var markers = [];
var $total = $('.brew-total');
var $list = $('.brew-list');
var $beerMe = $('button');

$beerMe.on('click', function(event) {
  event.preventDefault();
  var city = $('#city').val();
  var state = $('#state').val();
  $total.empty();
  $list.empty();
  coordArr = [];
  printArr = [];
  getLatLong(city, state);
  getListings(city, state);
});

function getLatLong(city, state) {
  var google = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&components=administrative_area:' + state + '&key=AIzaSyAu9tqAfwr9y_b4MUrI_Sg8iMbfIDe24Z0';
  $.get(google, function(object) {
    lat = object.results[0].geometry.location.lat;
    long = object.results[0].geometry.location.lng;
  });
}

function getListings(city, state) {
  var brewArr = [];
  var search = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Flocations%3Fkey%3D0d28b6999d59c70e170fb29165a647d2%26locality%3D' + city + '%26region%3D' + state;
  $.get(search, function(object) {
    if (object.numberOfPages === 1) {
      brewArr = object.data;
      extractInfo(brewArr);
    } else if (object.numberOfPages === 2) {
      brewArr = object.data;
      $.get(search + '%26p%3D2', function(object2) {
        brewArr = brewArr.concat(object2.data);
        extractBrewInfo(brewArr);
      });
    }
  });
}

function extractBrewInfo(arr) {
  var length = arr.length;
  $total.append($('<h4>').text('Listings (' + length + ')'));
  for (var i = 0; i < length; i++) {
    var brewName = arr[i].brewery.name;
    var brewID = arr[i].id;
    var type = arr[i].locationTypeDisplay;
    var address = arr[i].streetAddress;
    var zip = arr[i].postalCode;
    var phone = arr[i].phone;
    var breweryInfo = [brewName, brewID, type, address, zip, phone];
    printArr.push(breweryInfo);
    var brewLat = arr[i].latitude;
    var brewLong = arr[i].longitude;
    var mapInfo = [{lat: brewLat, lng: brewLong}, brewName];
    coordArr.push(mapInfo);
  }
  printInfo(printArr);
}

function printInfo(arr) {
  var length = arr.length;
  for (var i = 0; i < length; i++){
    $list.append($('<hr>'));
    $list.append($('<h3>', {
      text: arr[i][0],
      class: 'brew-search',
      id: arr[i][1]
    }));
    $list.append($('<h5>').text(arr[i][2]));
    $list.append($('<p>').html(arr[i][3] + ' ' + arr[i][4] + '<br/>' + arr[i][5]));
  }
  showMap(lat, long);
}

// URL Encoding
// %3D is =
// %3A is :
// %2F is /
// + is space
// %26 is &
// %3F is ?

function getBreweryInfoAndImg(brewID) {
  var brewDescription = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fbrewery%2F' + brewID + '%3Fkey%3D0d28b6999d59c70e170fb29165a647d2';
  $.get(brewDescription, function(object) {
    var description = object.data.description;
    var icon = object.data.images.icon;
    var medPic = object.data.images.medium;
    var lrgPic = object.data.images.large;
  });
  getBeers(brewID);
}

function getBeers(brewID) {
  var beerSearch = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fbrewery%2F' + brewID + '%2Fbeers%3Fkey%3D0d28b6999d59c70e170fb29165a647d2';
  $.get(beerSearch, function(object) {
    beerArr = object.data;
    extractBeerInfo(beerArr);
  });
}

getBeers('rQkKIB');

function extractBeerInfo(arr) {
  var length = arr.length;
  for (var i = 0; i < length; i++) {
    var beerName = arr[i].nameDisplay;
    var beerStyle = arr[i].style.name;
    var beerABV = arr[i].abv;
    var beerIBU = arr[i].ibu;
  }
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
