let search = $(".search");

let searchBtn = $(".searchBtn");
let cityBtn;
let citiesList = $(".cities");
let weatherContainer = $("#weather-container");
let cities = [];

let forecastContainer = $("#forecastContainer");
let fiveDayForecast = $("#forecast");

// ********** Search Functions **********

searchBtn.click(function (event) {
  if (search.val() !== "") {
    inputFunc();
  } else {
    alert("please enter a city");
  }
});

// adding a keypress event on the search input for the 'enter' key
$(search).keypress(function (event) {
  let keyCode = event.keyCode;
  if (keyCode === 13) {
    if (search.val() !== "") {
      inputFunc();
    } else {
      alert("please enter a city");
    }
  }
});

// putting functions, methods, and variables to be used within searchEvent into one function
function inputFunc() {
  event.preventDefault();
  citiesList.removeClass("hidden");
  weatherContainer.removeClass("hidden");
  cities.push(search.val());
  setStorage();
  createCityList(search.val());
  getWeather(search.val());
  search.val("");
}

function createCityList(lastCity) {
  // console.log(cities);
  cityBtn = $("<button>").addClass(
    "cityBtn btn btn-outline-secondary d-flex w-100"
  );
  cityBtn.text(lastCity);
  cityBtn.attr("data-city", lastCity);
  citiesList.prepend(cityBtn);

  cityBtn.click(function (event) {
    getWeather(event.target.getAttribute("data-city"));
  });
}

// ********** localStorage **********

function setStorage() {
  // setting array cities into localStorage above to be a stringified value
  localStorage.setItem("cities", JSON.stringify(cities));
}

// ********** API **********

function getWeather(city) {
  let apiKey = "6d2d2840d31a11364a7bbe1cba528b23";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl).then(function (response) {
    // console.log(response);
    response.json().then(function (data) {
      createCurrentConditions(data, city);
    });
  });
}

function getUvi(lat, lon) {
  let apiKey = "6d2d2840d31a11364a7bbe1cba528b23";
  let uviUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(uviUrl).then(function (response) {
    response.json().then(function (data) {
      createCurrentUvi(data);
    });
  });
}

function getForecast(lat, lon) {
  let apiKey = "6d2d2840d31a11364a7bbe1cba528b23";
  let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current,alerts&units=imperial&appid=${apiKey}`;
  console.log(forecastUrl);

  fetch(forecastUrl).then(function (response) {
    response.json().then(function (data) {
      createForecast(data);
    });
  });
}

// ********** Current Weather Conditions **********

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

  let lat = conditions.city.coord.lat;
  let lon = conditions.city.coord.lon;
  getUvi(lat, lon);
  getForecast(lat, lon);
}

function createCurrentUvi(uvi) {
  let currentUVI = $("#currentUVI").addClass("text-white p-1");
  let uviIndex = uvi.current.uvi;
  currentUVI.text(uviIndex);

  if (uviIndex <= 2) {
    currentUVI.addClass("bg-success");
  } else if (uviIndex > 2 && uviIndex <= 7) {
    currentUVI.addClass("bg-warning");
  } else if (uviIndex > 7) {
    currentUVI.addClass("bg-danger");
  }
}

function createForecast(forecast) {
  fiveDayForecast.text("");
  let dailyForecast = forecast.daily;
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
