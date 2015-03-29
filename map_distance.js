var map;
var geocoder;
var bounds = new google.maps.LatLngBounds();
var markersArray = [];

var url = window.location
var query = window.location.search.substring(1)
var string = JSON.stringify(query)
var stringArray = string.split("&")
valueArray = []
for (index in stringArray) {
  string = stringArray[index]
  var value = string.substring(string.indexOf("=") + 1)
  if (index == 2) {
    value = value.substring(0, value.length - 1)
  }
  valueArray[index] = value
}

var genre = JSON.stringify(valueArray[0])
var start = JSON.stringify(valueArray[1])
var dest = JSON.stringify(valueArray[2])





var origin1 = start
var destinationA = dest

var destinationIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=D|FF0000|000000';
var originIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';

function initialize() {
  var opts = {
    center: new google.maps.LatLng(71.05, 42.36),
    zoom: 2
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), opts);
  geocoder = new google.maps.Geocoder();
}

function calculateDistances() {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin1],
      destinations: [destinationA],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false
    }, callback);
}

function callback(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    alert('Error was: ' + status);
  } else {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    var outputDiv = document.getElementById('outputDiv');
    var timeDiv = document.getElementById('time-display');
    var hiddenDiv = document.getElementById('time');
    outputDiv.innerHTML = '';
    deleteOverlays();

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      addMarker(origins[i], false);
      for (var j = 0; j < results.length; j++) {
        addMarker(destinations[j], true);
        outputDiv.innerHTML += origins[i] + ' to ' + destinations[j]
            + ': ' + results[j].distance.text + ' in '
            + results[j].duration.text + '<br>';
        timeDiv.innerHTML = 'Travel time: ' + results[j].duration.text
        hiddenDiv.value = convertToMS(results[j].duration.text)
        hiddenDiv.innerHTML = hiddenDiv.value;
        display_dictionary(genre);
      }
    }
  }
}

function addMarker(location, isDestination) {
  var icon;
  if (isDestination) {
    icon = destinationIcon;
  } else {
    icon = originIcon;
  }
  geocoder.geocode({'address': location}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      bounds.extend(results[0].geometry.location);
      map.fitBounds(bounds);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        icon: icon
      });
      markersArray.push(marker);
    } else {
      alert('Geocode was not successful for the following reason: '
        + status);
    }
  });
}

function convertToMS(timeString) {
  var stringArray = timeString.split(" ")
  var seconds = 0;
  var onHours = false
  if (stringArray.length == 4) {
    onHours = true;
  }
  for (index in stringArray) {
    var num = parseInt(stringArray[index])
    if (!isNaN(num) && onHours) {
      seconds = num * 3600;
      onHours = false;
    }
    else if (!isNaN(num)) {
      seconds = seconds + num * 60;
    }
  }
  return seconds * 1000;
}

var songIDs = '';        // an empty array of length ?
var genreOfRadio;

function display_dictionary(genre){
    var myjson;
	genreOfRadio = genre;
    var blah = genre;
	var songIDs2 = '';
    $.getJSON("https://api.spotify.com/v1/search?query=track%3A%22" + blah + "%22&offset=0&limit=50&type=track", function(json){
        myjson = json;
        console.log(myjson);

    counter = 0;
    iteration = 0;
    tripLength = document.getElementById('time').innerText;
    for(i = 0; i <50; i++){
        current = Math.floor(Math.random() * 49);
        if(counter + myjson.tracks.items[current].duration_ms > tripLength){
            ;
        }
        else{
            counter += myjson.tracks.items[current].duration_ms;
			songIDs = songIDs.concat(myjson.tracks.items[current].id).concat(',');
			iteration = i;
        }
    }
	
	getPlaylistEmbedURL();
    console.log("the total song times add up to " + counter + " having gone through " + iteration + " songs when the length of the trip is " + tripLength);
    
	});
	
}

function getPlaylistEmbedURL(){
	
	document.getElementById("playlist").innerHTML='asdfasdfsdf';
	var embedURL = 'https://embed.spotify.com/?uri=spotify:trackset:title:';
	embedURL = embedURL.concat(songIDs);
	embedURL = embedURL.substring(0, embedURL.length-1);
	//<iframe src="https://embed.spotify.com/?uri=spotify:trackset:Artist radio for Maroon 5:3wJIAMuPdEoBddWlovWXCX,1D1nixOVWOxvNfWi0UD7VX,52TSjnEfXo40EzuylAhf6k,0VHs1X9AhxYfmyvikPO8Mt,1cALRwswLHxeETC2WH1llE,0oayy8OHHzuT1URyldeu9P,6IuVrhdSJiQM02zh03w42J,0rityYtUvS3dIdY1lvWXaY,760GxmiU9FCmP5jgnLsNtz,0dSchkfNB8SzYj8Bx7bcCW,7qnNnQTGxdzI2wZWpa0vDD,0jdeV5dSB3kUBRqe1xQJbh" style="width:640px; height:520px;" frameborder="0" allowtransparency="true"></iframe>
	
	document.getElementById("playlist").innerHTML='<iframe src="'+embedURL+'"style="width:480px; height:520px;" frameborder="0" allowtransparency="true"></iframe>';
}

function deleteOverlays() {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}

google.maps.event.addDomListener(window, 'load', initialize);
