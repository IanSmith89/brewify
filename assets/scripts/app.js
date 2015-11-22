var $button = $('button');
$button.on('click', function(event) {
  event.preventDefault();
  var $cityInput = $('#city');
  var city = $cityInput.val();
  var $stateInput = $('#state');
  var state = $stateInput.val();
  getList(city, state);
  showMap();
});

//URL Encoding for searchURL
// %3D is =
// %3A is :
// %2F is /
// + is space
// %26 is &

function getList(city, state) {
  var search = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Flocations%3Fkey%3D0d28b6999d59c70e170fb29165a647d2%26locality%3D' + city + '%26region%3D' + state;
  $.get(search, function(object) {
    var brewArr = object.data;
    display(brewArr);
  });
}

function display(list) {
  var $list = $('.brew-list');
  $list.empty();
  var length = list.length;
  for (var i = 0; i < length; i++) {
    var brewNames = list[i].brewery.name;
    var type = list[i].locationTypeDisplay;
    $list.append($('<li>').text(brewNames + ', ' + type));
    console.log(brewNames, type);
  }
}

function showMap() {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(44.5403, -78.5463),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);
}
// google.maps.event.addDomListener(window, 'load', initialize);
