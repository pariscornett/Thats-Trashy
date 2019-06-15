//global variables
let userInput = $("#city-search").val(); 
//form validation function
function validateSearch() {
  if(userInput == ""){
    alert("please enter a city name");
    return false;
  } else {
    runLocation();
  }
}; 
//weather api ajax call 
$("#submit").on("click", function runLocation(event){ 
  event.preventDefault();
  validateSearch();
  //hide the search bar after the initial search is made
  $("#initial-search-box").hide();
 
  //take the user input and store it in the variable userInput, then pass it into the queryUrl so that users can get custom info from ajax call
  let userInput = $("#city-search").val(); 
  let queryUrl = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=7eb8a9862ffc258b2705e3176ca3ab15&q=" + userInput + "&units=imperial";
  //actual call
  $.ajax({
  url: queryUrl,
  method: "GET"
}).then(function(response) { //promise
  console.log(response);
  //set variables to avoid repeated dot notation
  let city = response.city.name;
  let temperature = response.list[0].main.temp;
  let humidity = response.list[0].main.humidity;
  let seaLevel = response.list[0].main.sea_level;
  let lat = response.city.coord.lat;
  let long = response.city.coord.lon;
  console.log("city: " + city);
  console.log("temperature: " + temperature);
  console.log("humidity: " + humidity);
  console.log("sea level: " + seaLevel);
  console.log("latitude: " + lat);
  console.log("longitude: " + long);
  //display info retrieved to DOM, except the lat and long info, which will be used below with the open layers map
  $("#weather-display").append("<div class = city-info>" + city + "'s Current Weather Stats: ");
  $(".city-info").append("<div class = temperature> Temperature: "+ temperature);
  $(".temperature").append("<div class = humidity> Humidity: " + humidity);
  $(".humidity").append("<div class = seaLevel> Sea Level: " + seaLevel);
  //open layers map 
  var map = new ol.Map({
    target: 'map', //target tells open layers where to put the map
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([long,lat]), //use long and lat variables we got from the open weather map api to change the map's display
      zoom: 14 //sets default zoom for map 
    })
  });  
})
})

