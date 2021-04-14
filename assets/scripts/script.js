let searchCity = "";
let searchParameter = "";
let latitude;
let longitude;
let testObject = {};


let resultsDiv = document.getElementById("resultsDiv");

function searchLoc() {
    let searchVar;
    searchCity = $("#searchInput").val();
    console.log(searchCity);
    searchVar = "http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=d031f7d8412c7fab27c346dc9d664ac2";
    console.log(searchVar);
    fetch(searchVar)
    .then(function (response) {return response.json();})
    .then(function (data) {
      console.log(data);
      latitude = data.coord.lat;
      longitude = data.coord.lon;
      return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=d031f7d8412c7fab27c346dc9d664ac2");}
      .then(function (res) {return res.json();})
      .then(function (data1) {
        console.log(data1);
      })  
      );
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
  