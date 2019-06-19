let city;
let temperature;
let humidity;
let seaLevel;
let lat;
let long;

//hide button when page is initially loaded
$("#fly-buttons").hide();
//weather api ajax call 
$("#submit").on("click", function(event){
  //hide the search bar after the initial search is made
  $("#fly-buttons").show();
  $("#initial-search-box").hide();
  event.preventDefault();
  //take the user input and store it in the variable userInput, then pass it into the queryUrl so that users can get custom info from ajax call
  let userInput = $("#city-search").val();
  let weatherQueryUrl = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=7eb8a9862ffc258b2705e3176ca3ab15&q=" + userInput + "&units=imperial";
  //actual call
  $.ajax({
  url: weatherQueryUrl,
  method: "GET"
  
}).then(function(response) { //promise
  console.log(response);
  //set variables to avoid repeated dot notation
  let city = response.city.name;
  let temperature = parseInt(response.list[0].main.temp);
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
  $(".city-info").append("<div class = temperature> Temperature: "+ temperature +"&#8457;");
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

  // Foursquare API
  let clientID = "3C4SB3NU2CPTLYSZRFHY0W032YTEPL2OKYALGGW2XZSGQJYL";
  let clientSecret = "C2RQWRLPF5ROBLCFVEBZKFPBMARI2RBRMWBMXH4K1SQBBZPF";
  let foursquareQueryUrl = "https://api.foursquare.com/v2/venues/search?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20180323&ll=" + lat +"," + long +"&query=recycling";

  //don't mess with this just in case
  // let foursquareQueryUrl = "https://api.foursquare.com/v2/venues/search?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20180323&limit=10&ll=" + lat +"," + long +"&intent=browse&query=recycling";

  //AJAX call for Foursquare
  $.ajax({
    url: foursquareQueryUrl,
    method: "GET"
  })
  .then(function(response) {
    var recyclingCenterName = response.response.venues[0].name;
    var recyclingCenterAddress = response.response.venues[0].location.address;
    var recyclingCenterLat =response.response.venues[0].location.lat;
    var recyclingCenterLong = response.response.venues[0].location.lng;


    //console logs for recycling query search
    console.log(response);
    console.log(response.response.venues[0].name);
    //appends venues to the page
    $("#recyclingName").append(recyclingCenterName);
    $("#recyclingLocation").append(recyclingCenterAddress);

    //function for fly animation with map
    function flyTo(location, done) {
      var duration = 2000;
      var zoom = view.getZoom();
      var parts = 2;
      var called = false;
      function callback(complete) {
        --parts;
        if (called) {
          return;
        }
        if (parts === 0 || !complete) {
          called = true;
          done(complete);
        }
      }
      view.animate({
        center: location,
        duration: duration
      }, callback);
      view.animate({
        zoom: zoom - 1,
        duration: duration / 2
      }, {
        zoom: zoom,
        duration: duration / 2
      }, callback);
    }

    // onClick('fly-to-bern', function() {
    //   flyTo(recyclingCenterLong + recyclingCenterLat, function() {});
    // });

    $("#fly-to-bern").on("click", function(){
      flyTo(recyclingCenterLong + recyclingCenterLat, function() {});
    });


  }); 
})

})

