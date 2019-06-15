//weather api ajax call 
$("#submit").on("click", function(event){
  $("#search-box").hide();
  event.preventDefault();
  let userInput = $("#city-search").val();
  let queryUrl = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=7eb8a9862ffc258b2705e3176ca3ab15&q=" + userInput + "&units=imperial";
  
  $.ajax({
  url: queryUrl,
  method: "GET"
}).then(function(response) {
  console.log(response);
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
  $("#weather-display").append("<div class = city-info>" + city + "'s Current Weather Stats: ");
  $(".city-info").append("<div class = temperature> Temperature: "+ temperature);
  $(".temperature").append("<div class = humidity> Humidity: " + humidity);
  $(".humidity").append("<div class = seaLevel> Sea Level: " + seaLevel);
  //open layers library map 
var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([long,lat]),
    zoom: 14
  })
});
  
})

})


