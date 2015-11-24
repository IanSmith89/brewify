
var lat, long, info, printArr, beerArr;
var $total = $('.brew-total');
var $list = $('.brew-list');
var $beerMe = $('button');
var $breweryImg = $('.brewery-img');
var $breweryDescription = $('.brewery-description');
var $breweryBeers = $('.brewery-beers');

$beerMe.on('click', function(event) {
  event.preventDefault();
  var city = $('#city').val();
  var state = $('#state').val();
  $total.empty();
  $list.empty();
  $breweryDescription.empty();
  $breweryBeers.empty();
  printArr = [];
  beerArr = [];
  markers = [];
  getLatLong(city, state);
});

function getLatLong(city, state) {
  var googleMap = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&components=administrative_area:' + state + '&key=AIzaSyAu9tqAfwr9y_b4MUrI_Sg8iMbfIDe24Z0';
  $.get(googleMap, function(object) {
    lat = object.results[0].geometry.location.lat;
    long = object.results[0].geometry.location.lng;
  });
  getListings(city, state);
}

function getListings(city, state) {
  var brewArr = [];
  var search = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Flocations%3Fkey%3D0d28b6999d59c70e170fb29165a647d2%26locality%3D' + city + '%26region%3D' + state;
  $.get(search, function(object) {
    if (object.numberOfPages === 1) {
      brewArr = object.data;
      extractBreweryInfo(brewArr);
    } else if (object.numberOfPages === 2) {
      brewArr = object.data;
      $.get(search + '%26p%3D2', function(object2) {
        brewArr = brewArr.concat(object2.data);
        extractBreweryInfo(brewArr);
      });
    }
  });
}

function extractBreweryInfo(arr) {
  arr.forEach(function(obj) {
    if (obj.isClosed === 'N' && obj.status === 'verified') {
      var brewName = obj.brewery.name;
      var breweryID = obj.brewery.id;
      var type = obj.locationTypeDisplay;
      var address = obj.streetAddress;
      var zip = obj.postalCode;
      var phone = obj.phone;
      var website = obj.brewery.website;
      var brewDescribe = obj.brewery.description;
      var brewImgObj = obj.brewery.images;
      var brewLat = obj.latitude;
      var brewLong = obj.longitude;
      var brewCoord = {lat: brewLat, lng: brewLong};
      var breweryInfo = [brewName, breweryID, type, address, zip, phone, website, brewDescribe, brewImgObj, brewCoord];
      printArr.push(breweryInfo);
    }
  });
  showMap(lat, long);
}

function showMap(lat, long) {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(lat, long),
    zoom: 13,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(mapCanvas, mapOptions);
  info = new google.maps.InfoWindow();
  drop(printArr);
}

function drop(arr) {
  var length = arr.length;
  for (var i = 0; i < length; i++) {
    addMarkerWithTimeout(arr[i][9], arr[i][0], arr[i][1], i * 75);
  }
  printSearchResults(printArr, markers);
}

function addMarkerWithTimeout(position, title, id, timeout) {
  window.setTimeout(function() {
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      title: title,
      id: id
    });
    marker.addListener('click', function() {
      $breweryDescription.empty();
      $breweryBeers.empty();
      showBreweryInfo(marker.id, printArr);
      info.setContent(title);
      info.open(map, marker);
    });
    markers.push(marker);
  }, timeout);
}

function printSearchResults(arr, arr2) {
  var length = arr.length;
  $total.append($('<h4>').text('Listings (' + length + ')'));
  for (var i = 0; i < length; i++){
    $list.append($('<hr>'));
    var h3 = $('<h3>', {
      text: arr[i][0],
      class: 'brew-search',
      id: arr[i][1]
    });
    h3.on('click', function(event) {
      $breweryDescription.empty();
      $breweryBeers.empty();
      showBreweryInfo(event.target.id, printArr);
      for (var i = 0; i < arr2.length; i++) {
        if (event.target.id === arr2[i].id) {
          info.setContent(arr[i][0]);
          info.open(map, arr2[i]);
          break;
        }
      }
    });
    $list.append(h3);
    $list.append($('<h5>').text(arr[i][2]));
    $list.append($('<p>').html(arr[i][3] + ' ' + arr[i][4] + '<br/>' + arr[i][6] + '<br/>' + arr[i][5]));
  }
}

// URL Encoding
// %3D is =
// %3A is :
// %2F is /
// + is space
// %26 is &
// %3F is ?

// Odells ID = rQkKIB

// Google maps api key = AIzaSyAu9tqAfwr9y_b4MUrI_Sg8iMbfIDe24Z0
// Brewify original key = 0d28b6999d59c70e170fb29165a647d2
// "Tastify" key = 5d9d85e15c6f2c4014a61a35ba6b6dc0

function showBreweryInfo(id, objArr) {
  for (var i = 0; i < objArr.length; i++) {
    if (id === objArr[i][1]) {
      $breweryDescription.append($('<h3>').text("Here's the lowdown..."));
      $breweryDescription.append($('<img>', {
        class: 'img-responsive',
        src: objArr[i][8].large
      }));
      $breweryDescription.append($('<h2 class="text-center">').text(objArr[i][0]));
      $breweryDescription.append($('<p>').text(objArr[i][7]));
      // getBeers(id);
      break;
    }
  }
}

function getBeers(brewID) {
  $breweryBeers.append($('<h3>').text('Beer List'));
  var beerSearch = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fbrewery%2F' + brewID + '%2Fbeers%3Fkey%3D0d28b6999d59c70e170fb29165a647d2';
  $.get(beerSearch, function(obj) {
    beerArr = obj.data;
    extractBeerListAndPrint(beerArr);
  });
}

function extractBeerListAndPrint(arr) {
  arr.forEach(function(obj) {
    if (obj.status === 'verified') {
      var beerName = obj.nameDisplay;
      var beerStyle = obj.style.shortName;
      var beerABV = obj.abv;
      var beerIBU = obj.ibu;
      $breweryBeers.append($('<hr>'));
      $breweryBeers.append($('<h4>').text(beerName));
      $breweryBeers.append($('<h5>').text(beerStyle));
      $breweryBeers.append($('<p>').text(beerABV + '% ABV, ' + beerIBU + ' IBU'));
    }
  });
}
