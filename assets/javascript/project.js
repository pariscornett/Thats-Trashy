//form validation function
var userInput = "";
// var instance = $M.Modal.getInstance(elem);

function validateSearch() {
  console.log(userInput);
  if (userInput == "") {
    alert("please enter a city name");
    // $('.modal').modal('methodName');
    return false;
  } else {
    return true;
  }
};

//hide map and weather box before submit is clicked
$("#weather-display").hide();
$("#recycling-centers").hide();
$("#map").hide();

//weather api ajax call 
$("#submit").on("click", function runLocation(event) {
  event.preventDefault();
  userInput = $("#city-search").val();
  if (validateSearch() === true) {
    //show map and weather box before submit is clicked
    $("#weather-display").show();
    $("#recycling-centers").show();
    $("#map").show();
    //hide the search bar after the initial search is made
    $("#initial-search-box").hide();

    //take the user input and store it in the variable userInput, then pass it into the queryUrl so that users can get custom info from ajax call
    let userInput = $("#city-search").val();
    let weatherQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=7eb8a9862ffc258b2705e3176ca3ab15&q=" + userInput + "&units=imperial";
    validateSearch();

    //actual call
    $.ajax({
      url: weatherQueryUrl,
      method: "GET"
    }).then(function (response) { //promise
      // console.log(response);
      //set variables to avoid repeated dot notation
      let city = response.city.name;
      let temperature = parseInt(response.list[0].main.temp);
      let humidity = response.list[0].main.humidity;
      let seaLevel = parseInt(response.list[0].main.sea_level);
      let lat = response.city.coord.lat;
      let long = response.city.coord.lon;
      // console.log("city: " + city);
      // console.log("temperature: " + temperature);
      // console.log("humidity: " + humidity);
      // console.log("sea level: " + seaLevel);
      // console.log("latitude: " + lat);
      // console.log("longitude: " + long);
      //display info retrieved to DOM, except the lat and long info, which will be used below with the open layers map
      $("#weather-display").append("<div class = city-info>" + city + "'s Current Weather Stats: ");
      $(".city-info").append("<div class = temperature> Temperature: " + temperature + "&#8457;");
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
          center: ol.proj.fromLonLat([long, lat]), //use long and lat variables we got from the open weather map api to change the map's display
          zoom: 12 //sets default zoom for map 
        })
      });

      // Foursquare API
      let clientID = "3C4SB3NU2CPTLYSZRFHY0W032YTEPL2OKYALGGW2XZSGQJYL";
      let clientSecret = "C2RQWRLPF5ROBLCFVEBZKFPBMARI2RBRMWBMXH4K1SQBBZPF";
      let foursquareQueryUrl = "https://api.foursquare.com/v2/venues/search?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20180323&ll=" + lat + "," + long + "&query=recycling";

      //don't mess with this just in case
      // let foursquareQueryUrl = "https://api.foursquare.com/v2/venues/search?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20180323&limit=10&ll=" + lat +"," + long +"&intent=browse&query=recycling";

      //AJAX call for Foursquare
      $.ajax({
        url: foursquareQueryUrl,
        method: "GET"
      })
        .then(function (response) {
          console.log(response);
          var listTitle = userInput + " Recycling Centers :";

          $("#listTitle").text(listTitle)
          for (var i = 0; i < 10; i++) {
            // console.log(response.response.venues[i].name)
            var itemName = $("<p>")
            var itemLocation = $("<p>")
            var itemCrossStreet = $("<p>")
            var itemBreak = $("<br />")

            itemName.text(response.response.venues[i].name)
            itemLocation.text(response.response.venues[i].location.address)
            itemCrossStreet.text(response.response.venues[i].location.crossStreet)
            // Formatted Address:
            // itemLocation.text(response.response.venues[i].location.formattedAddress[0])
            // itemCrossStreet.text(response.response.venues[i].location.formattedAddress[1])
            // console.log(item) 
            $("#centerList").append(itemName)
            $("#centerList").append(itemLocation)
            $("#centerList").append(itemCrossStreet)
            $("#centerList").append(itemBreak)

            generateMarkers(map, response);


          }

        });
    })
    var moreInfoBtn = $("<button>")
    var faqURL = "assets/recyclingFAQ.html";
    // var showMore = "Show More"
    moreInfoBtn = "<a href=" + faqURL + ">See More</a>"
    $("#moreInfo").append(moreInfoBtn);
    // moreInfoBtn.attr( "<a href =" + faqURL + "class=btn-floating btn-large waves-effect waves-light red><i class=material-icons>add</i></a>")
    // $("#moreInfo").append(moreInfoBtn);
  }
})



// this function cycles through each of the top 10 data points, adds  a  custom red marker as well as a label
function generateMarkers(map, data) {

  for (var i = 0; i < 10; i++) {
    var lat = data.response.venues[i].location.lat;
    var long = data.response.venues[i].location.lng;
    var label = data.response.venues[i].name;

    console.log(lat)
    var marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([long, lat])
      )
    });

    marker.setStyle(new ol.style.Style({
      image: new ol.style.Icon(({
        crossOrigin: '',
        height: '30px',
        width: '30px',
        src: 'https://prospectareachamber.org/wp-content/uploads/2017/12/map-marker-icon-e1512334260964.png'
      })),
      text: new ol.style.Text({
        text: label,
        offsetY: -25,
        fill: new ol.style.Fill({
          color: "#000",


        })
      })
    }));


    var vectorSource = new ol.source.Vector({
      features: [marker],

    });

    var markerVectorLayer = new ol.layer.Vector({
      source: vectorSource
    });

    map.addLayer(markerVectorLayer);
  }


}