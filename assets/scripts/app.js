
// Google maps api key = AIzaSyAu9tqAfwr9y_b4MUrI_Sg8iMbfIDe24Z0
// Brewify original key = 0d28b6999d59c70e170fb29165a647d2
// "Tastify" key = 5d9d85e15c6f2c4014a61a35ba6b6dc0

var lat, long, info, coordArr, printArr, beerArr, clickArr, lrgImg;
var markers = [];
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
  $breweryImg.empty();
  $breweryDescription.empty();
  $breweryBeers.empty();
  coordArr = [];
  printArr = [];
  clickArr = [];
  beerArr = [];
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
  var search = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Flocations%3Fkey%3D5d9d85e15c6f2c4014a61a35ba6b6dc0%26locality%3D' + city + '%26region%3D' + state;
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
  var length = arr.length;
  $total.append($('<h4>').text('Listings (' + length + ')'));
  arr.forEach(function(obj) {
    var brewName = obj.brewery.name;
    var breweryID = obj.brewery.id;
    var type = obj.locationTypeDisplay;
    var address = obj.streetAddress;
    var zip = obj.postalCode;
    var phone = obj.phone;
    var website = obj.brewery.website;
    var breweryInfo = [brewName, breweryID, type, address, zip, phone, website];
    printArr.push(breweryInfo);
    var brewDescribe = obj.brewery.description;
    var brewImgObj = obj.brewery.images;
    var inCaseOfClick = [brewDescribe, brewImgObj, breweryID];
    clickArr.push(inCaseOfClick);
    var brewLat = obj.latitude;
    var brewLong = obj.longitude;
    var mapInfo = [{lat: brewLat, lng: brewLong}, brewName];
    coordArr.push(mapInfo);
  });
  printInfo(printArr);
}

function printInfo(arr) {
  var length = arr.length;
  for (var i = 0; i < length; i++){
    $list.append($('<hr>'));
    var h3 = $('<h3>', {
      text: arr[i][0],
      class: 'brew-search',
      id: arr[i][1]
    });
    h3.on('click', function(event){
      // getBreweryInfoAndImg(event.target.id);
      $breweryImg.empty();
      $breweryDescription.empty();
      $breweryBeers.empty();
      showBreweryInfo(event.target.id, clickArr);
    });
    $list.append(h3);
    $list.append($('<h5>').text(arr[i][2]));
    $list.append($('<p>').html(arr[i][3] + ' ' + arr[i][4] + '<br/>' + arr[i][5] + '<br/>' + arr[i][6]));
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

// Odells ID = rQkKIB

// function getBreweryInfoAndImg(brewID) {
//   $breweryImg.empty();
//   $breweryDescription.empty();
//   $breweryBeers.empty();
//   var brewDescription = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fbrewery%2F' + brewID + '%3Fkey%3D5d9d85e15c6f2c4014a61a35ba6b6dc0';
//   $.get(brewDescription, function(object) {
//     // console.log(object);
//     var description = object.data.description;
//     var lrgImg = object.data.images.large;
//     showBreweryInfo(description, lrgImg);
//   });
//   getBeers(brewID);
// }

// function showBreweryInfo(description, image) {
//   $breweryDescription.append($('<h3>').text('Description'));
//   $breweryDescription.append($('<p>').text(description));
//   $breweryImg.append($('<h3>').text('Brewery'));
//   $breweryImg.append($('<img>', {
//     class: 'img-responsive',
//     src: image
//   }));
// }

function showBreweryInfo(id, objArr) {
  objArr.forEach(function(arr) {
    if (id === arr[2]) {
      $breweryDescription.append($('<h3>').text('Description'));
      $breweryDescription.append($('<p>').text(arr[0]));
      $breweryImg.append($('<h3>').text('Brewery'));
      $breweryImg.append($('<img>', {
        class: 'img-responsive',
        src: arr[1].large
      }));
      getBeers(id);
    }
  });
}

function getBeers(brewID) {
  $breweryBeers.append($('<h3>').text('Beer List'));
  var beerSearch = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Fbrewery%2F' + brewID + '%2Fbeers%3Fkey%3D5d9d85e15c6f2c4014a61a35ba6b6dc0';
  $.get(beerSearch, function(object) {
    beerArr = object.data;
    extractBeerInfoAndPrint(beerArr);
  });
}

function extractBeerInfoAndPrint(arr) {
  arr.forEach(function(obj) {
    var beerName = obj.nameDisplay;
    var beerStyle = obj.style.name;
    var beerABV = obj.abv;
    var beerIBU = obj.ibu;
    $breweryBeers.append($('<hr>'));
    $breweryBeers.append($('<h4>').text(beerName));
    $breweryBeers.append($('<h5>').text(beerStyle));
    $breweryBeers.append($('<p>').text(beerABV + '% ABV, ' + beerIBU + ' IBU'));
  });
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
