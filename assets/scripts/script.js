// Declaring the required global variables.
let searchCity = "";
let latitude;
let longitude;
let searchHistory = [];


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
// Function for styling the UV Index pill.
function readUvi(uvi) {
    if (uvi <= 2) {
        return "#adffdc";
    }
    if (2 < uvi <= 5) {
        return "#ffe799";
    }
    if (5 < uvi <= 7) {
        return "f7bca1";
    }
    if (7 < uvi <= 10) {
        return "#ea9a9d";
    }
    if (uvi > 10) {
        return "#dfa4f4";
    }
}
// Function for pulling the history out of local storage if it exists.
function retrieveHistory() {
    if (!localStorage.getItem('cities')) {
        localStorage.setItem('cities', JSON.stringify(searchHistory));
    } else {
        searchHistory = JSON.parse(localStorage.getItem('cities'));
    }
}
// Function for creating the history buttons out of local storage.
function initializeButtons() {
    retrieveHistory();
    $("#currentConditions").append('<p id="conditionsContainer">Enter a city name to view current and future weather conditions.</p>')
    for (let i = 0; i < searchHistory.length; i++) {
        let historyArea = $("#history")
        historyArea.append(`<button class="cityHistory" data-value="${searchHistory[i]}">${searchHistory[i]}</button>`)
    }
}
initializeButtons();
// Function for adding buttons to history section and storing them locally.
function expandHistory(searchCity) {
    let duplicate = false;
    for (let i = 0; i < searchHistory.length; i++) {
        if (searchCity == searchHistory[i]) {
            duplicate = true;
        }
    }
    if (!duplicate) {
        let historyArea = $("#history")
        historyArea.append(`<button class="cityHistory" data-value="${searchCity}">${searchCity}</button>`)
        searchHistory.push(searchCity);
        localStorage.setItem('cities', JSON.stringify(searchHistory));
    }

}
// Function for making the API call and dynamically displaying response to the user.
function searchLoc() {
    let searchVar;
    searchCity = $("#searchInput").val();
    searchVar = "http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=ecb2b034bde3b7f00daa738ddf58f8c4";
    fetch(searchVar)
    .then(function (response) {
        if (response.ok === false) {console.log("false"); return;}
        expandHistory(searchCity);
        return response.json();})
    .then(function (data) {
      latitude = data.coord.lat;
      longitude = data.coord.lon;
      let searchCoords = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=ecb2b034bde3b7f00daa738ddf58f8c4";
      fetch(searchCoords)
      .then(function (response) {return response.json();})
      .then(function (data) {
        // Current day variables for display.
        $("#conditionsContainer").remove();
        $("#fiveDayContainer").remove();
        let currentTime = dayjs.unix(data.current.dt).format('ddd, MMM D, YYYY h:mm A');
        let currentTemp = data.current.temp;
        let currentWind = data.current.wind_speed;
        let windDirection = parseWind(data.current.wind_deg);
        let currentHumidity = data.current.humidity;
        let currentUv = data.current.uvi;
        let current = $("#currentConditions");
        current.append(`<div id="conditionsContainer"></div>`);
        current = $("#conditionsContainer");
        current.append(`<h2>Current weather conditions for:<br>${searchCity.toUpperCase()} - ${currentTime}</h2><img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="${data.current.weather[0].description}"><br>`);
        current.append(`<span>Temperature: ${currentTemp}&deg</span><br>`);
        current.append(`<span>Winds: ${currentWind}MPH out of the ${windDirection}</span><br>`);
        current.append(`<span>Humidity: ${currentHumidity}%</span><br>`);
        current.append(`<span>U/V Index: <span class="pill" style="background-color: ${readUvi(currentUv)}">${currentUv}</span></span>`);
        let fiveDay = $("#fiveDay");
        fiveDay.append('<div id="fiveDayContainer"></div>');
        fiveDay = $("#fiveDayContainer");
        fiveDay.append("<h3>Five-Day Outlook</h3>");
        for (let i = 1; i < 6; i++) {
            fiveDay.append(`<div id="day${i}" class="day"></div>`);
            let dayContainer = $(`#day${i}`)
            let dateString = dayjs.unix(data.daily[i].dt).format('MM/DD/YYYY');
            dayContainer.append(`<h4>${dateString}</span><h4><img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png" alt="${data.daily[i].weather[0].description}">`);
            dayContainer.append(`<span>Temperature (High/Low): ${data.daily[i].temp.max}&deg/${data.daily[i].temp.min}&deg</span><br>`);
            dayContainer.append(`<span>Winds: ${data.daily[i].wind_speed}MPH</span><br>`);
            dayContainer.append(`<span>Humidity: ${data.daily[i].humidity}%</span>`);
        }
    })
    })
}
$('#searchButton').on('click', function (event) {
    event.preventDefault();
    searchLoc();}
);

$('#history').children('button').on('click', function (event) {
    let oldCity = $(event.target).attr('data-value');
    $("#searchInput").val(oldCity);
    searchLoc();
    }
);
