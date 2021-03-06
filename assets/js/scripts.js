// Setting global variables
let search = $(".search");
let searchBtn = $(".searchBtn");
let cityBtn;
let citiesList = $(".cities");
let weatherContainer = $("#weather-container");
let forecastContainer = $("#forecastContainer");
let fiveDayForecast = $("#forecast");

// creating an empty array to be used below
let cities = [];

// ***************** Search Functions *****************
// adding a click listener to searchBtn
searchBtn.click(function (event) {
  // if search.val() is not empty, then continue...
  if (search.val() !== "") {
    inputFunc();
  } else {
    alert("please enter a city");
  }
});

// adding a keypress event on the search input for the 'enter' key
$(search).keypress(function (event) {
  // setting the key code of the button pressed to a variable
  let keyCode = event.keyCode;
  // if keyCode strictly equals 13 (enter)...
  if (keyCode === 13) {
    // if search.val() is not empty, then continue...
    if (search.val() !== "") {
      inputFunc();
    } else {
      alert("please enter a city");
    }
  }
});

// putting functions, methods, and variables to be used within search events into one function
function inputFunc() {
  // preventing default actions of event
  event.preventDefault();
  // removing class hidden from elements to display them
  citiesList.removeClass("hidden");
  weatherContainer.removeClass("hidden");
  // pushing the search value into the cities array declared above
  cities.push(search.val());
  // setting localStorage
  setStorage();
  // create city serach btns
  createCityList(search.val());
  // getting current and forcasted weather
  getWeather(search.val());
  // clearing the input
  search.val("");
}

// creating a function to list search values as buttons
function createCityList(lastCity) {
  // creating a button element
  cityBtn = $("<button>").addClass(
    "cityBtn btn btn-outline-secondary d-flex w-100"
  );
  cityBtn.text(lastCity);
  cityBtn.attr("data-city", lastCity);
  // putting the last button made before the previous buttons
  citiesList.prepend(cityBtn);

  // adding a click event on cityBtns created above
  cityBtn.click(function (event) {
    // accessing the data attribute and getting weather
    getWeather(event.target.getAttribute("data-city"));
  });
}

// ***************** localStorage *****************

// setting localStorage
function setStorage() {
  // setting cities array into localStorage above to be a stringified value
  localStorage.setItem("cities", JSON.stringify(cities));
}

// ***************** API *****************

// using a function to fetch openweathermap api to get current weather conditions
function getWeather(city) {
  // setting api key to a variable
  let apiKey = "6d2d2840d31a11364a7bbe1cba528b23";
  // setting api url to a variable
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  // fetching apiUrl
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      // getting current weather conditions and displaying to page
      createCurrentConditions(data, city);
    });
  });
}

// using a function to fetch openweathermap api to get current uv index
function getUvi(lat, lon) {
  let apiKey = "6d2d2840d31a11364a7bbe1cba528b23";
  let uviUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(uviUrl).then(function (response) {
    response.json().then(function (data) {
      // creating current uv index and displaying to page
      createCurrentUvi(data);
    });
  });
}

// using a function to fetch openweathermap api to get forecasted weather
function getForecast(lat, lon) {
  let apiKey = "6d2d2840d31a11364a7bbe1cba528b23";
  let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current,alerts&units=imperial&appid=${apiKey}`;

  fetch(forecastUrl).then(function (response) {
    response.json().then(function (data) {
      // creating forecast and displaying to page
      createForecast(data);
    });
  });
}

// ***************** Current Weather Conditions *****************

// using a function to create current weather conditions elements
function createCurrentConditions(conditions, city) {
  // Creating
  let currentCity = $("#currentCity");
  currentCity.text(conditions.city.name);

  let currentDate = $("<span>");
  currentDate.text(` (${moment(conditions.list.dt_txt).format("M/D/YYYY")})`);
  currentCity.append(currentDate);

  let currentIcon = $("<img>");
  let icon = conditions.list[0].weather[0].icon;
  let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  currentIcon.attr("src", iconUrl);
  currentCity.append(currentIcon);

  let currentTemp = $("#currentTemp");
  currentTemp.text(conditions.list[0].main.temp);

  let currentHumidity = $("#currentHumidity");
  currentHumidity.text(conditions.list[0].main.humidity);

  let currentWind = $("#currentWind");
  currentWind.text(conditions.list[0].wind.speed);

  // setting lat and lon to be passed through getUvi and getForecast functions below
  let lat = conditions.city.coord.lat;
  let lon = conditions.city.coord.lon;
  getUvi(lat, lon);
  getForecast(lat, lon);
}

// using a function to create current uv index elements
function createCurrentUvi(uvi) {
  let currentUVI = $("#currentUVI").addClass("text-white p-1");
  let uviIndex = uvi.current.uvi;
  currentUVI.text(uviIndex);

  // setting background color of uv index depending on the severity
  if (uviIndex <= 2) {
    currentUVI.addClass("bg-success");
  } else if (uviIndex > 2 && uviIndex <= 7) {
    currentUVI.addClass("bg-warning");
  } else if (uviIndex > 7) {
    currentUVI.addClass("bg-danger");
  }
}

// using a function to create current forecasted weather elements
function createForecast(forecast) {
  // clearing any previous elements created
  fiveDayForecast.text("");

  let dailyForecast = forecast.daily;
  // looping through forecasted days from api and stopping at the 5th day
  for (let i = 1; i < 6; i++) {
    let nextDay = dailyForecast[i];
    let forcastedDay = moment(nextDay.dt * 1000).format("M/D/YYYY");

    let dayWeather = $("<div>").addClass(
      "card d-flex bg-primary text-white p-3 col-8 col-xl-2 col-md-4 col-sm-4 m-3"
    );
    fiveDayForecast.append(dayWeather);

    let weatherDate = $("<h5>").addClass("d-flex justify-content-center");
    weatherDate.text(forcastedDay);
    dayWeather.append(weatherDate);

    let forecastIcon = nextDay.weather[0].icon;
    let forecastIconUrl = `http://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
    let weatherIcon = $("<img>").attr("src", forecastIconUrl);
    dayWeather.append(weatherIcon);

    let maxTemp = $("<span>").addClass("text-start");
    maxTemp.text(`Max: ${nextDay.temp.max}°F`);
    dayWeather.append(maxTemp);

    let minTemp = $("<span>").addClass("text-start");
    minTemp.text(`Min: ${nextDay.temp.min}°F`);
    dayWeather.append(minTemp);

    let dayHumidity = $("<span>").addClass("text-start");
    dayHumidity.text(`Humidity: ${nextDay.humidity}%`);
    dayWeather.append(dayHumidity);
  }
}
