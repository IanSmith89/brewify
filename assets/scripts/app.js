//
// var getBeer = new XMLHttpRequest();
// getBeer.onreadystatechange = function(){
//   if (this.readyState === 4) {
//     if(this.status < 400) {
//       var data = JSON.parse(this.responseText);
//       console.log(this.responseText);
//       console.log(data);
//     }
//   }
// };
// getBeer.open('GET', 'http://beermapping.com/webservice/loccity/cde4273a2c0ee01fedcd666524ca32bb/lyons,co');
// getBeer.send();


//URL Encoding
// %3D is =
// %3A is :
// %2F is /
// + is space
function initialize() {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(44.5403, -78.5463),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(mapCanvas, mapOptions)
}
google.maps.event.addDomListener(window, 'load', initialize);


var finalURL = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fapi.brewerydb.com%2Fv2%2Flocations%3Fkey%3D0d28b6999d59c70e170fb29165a647d2%26locality%3DAnn+Arbor';

$.get(finalURL, function(object){
  console.log(object);
});
