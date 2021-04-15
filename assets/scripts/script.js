let searchCity = "";
let searchParameter = "";
let latitude;
let longitude;
let testObject = {};

// Function to convert wind degrees to Cardinal directions.
function parseWind(windDeg) {
    if (windDeg < 22.5) {return "N"}
    if (22.5 <= windDeg < 67.5) {return "NE"}
    if (67.5 <= windDeg < 112.5) {return "E"}
    if (112.5 <= windDeg < 157.5) {return "SE"}
    if (157.5 <= windDeg < 202.5) {return "S"}
    if (202.5 <= windDeg < 247.5) {return "SW"}
    if (247.5 <= windDeg < 292.5) {return "W"}
    if (292.5 <= windDeg < 337.5) {return "NW"}
    if (337.5 <= windDeg) {return "N"}
}

let resultsDiv = document.getElementById("resultsDiv");

function searchLoc() {
    let searchVar;
    searchCity = $("#searchInput").val();
//    console.log(searchCity);
    searchVar = "http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=ecb2b034bde3b7f00daa738ddf58f8c4";
//    console.log(searchVar);
    fetch(searchVar)
    .then(function (response) {return response.json();})
    .then(function (data) {
//      console.log(data);
      latitude = data.coord.lat;
      longitude = data.coord.lon;
      let searchCoords = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=ecb2b034bde3b7f00daa738ddf58f8c4";
//      console.log(searchCoords);
      fetch(searchCoords)
      .then(function (response) {return response.json();})
      .then(function (data) {
        // Current day variables for display.
        let currentTemp = data.current.temp;
        let currentWind = data.current.wind_speed;
        let windDirection = parseWind(data.current.wind_deg);
        let currentHumidity = data.current.humidity;
        let currentUv = data.current.uvi;
        console.log("Current temp: " + currentTemp);
        console.log(currentWind + "MPH out of the " + windDirection);
        console.log(currentHumidity);
        console.log(currentUv);
        // Five day forecast variables for display.
        console.log("----------------5-day Forecast----------------");
        for (let i = 0; i < 5; i++) {
            console.log(data.daily[i].dt);
            console.log(data.daily[i].weather[0].description);
            console.log(data.daily[i].temp);
            console.log(data.daily[i].wind_speed + parseWind(data.daily[0].wind_deg));
            console.log(data.daily[i].humidity);
        }
    })
    })
    //.then(function (data) {fetch(searchCoords);})
    //   .then(function (data1) {
    //     console.log(data1);
    //   })  
    //   );
    //   console.log(data.coord.lat);
    //   console.log(longitude);

      // searchVar = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=d031f7d8412c7fab27c346dc9d664ac2"
    // console.log(searchVar);
    // fetch(searchVar)
    //   .then(function (response) {
    //     return response.json();
    //   })
    //   .then(function (data) {
    //     console.log(data);
    //   });
}
$('#searchButton').on('click', searchLoc);
  