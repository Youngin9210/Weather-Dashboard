let search = $(".search");

let searchBtn = $(".searchBtn");
let citiesList = $(".cities");
let cityLiEl = $("<li>").addClass("list-group-item");
let cityBtn = $("<button>").addClass(
  "cityBtn btn btn-outline-secondary d-flex w-100"
);
let weatherContainer = $("#weather-container");
let cities = [];

// ********** Search Functions **********

// function to be called on later to implement a click event on searchBtn
function searchEvent() {
  // adding a click event to searchBtn
  searchBtn.click(function (event) {
    if (search.val() !== "") {
      inputFunc();
    } else {
      console.log("please enter a city");
    }
  });

  // adding a keypress event on the search input
  $(search).keypress(function (event) {
    let keyCode = event.keyCode;
    if (keyCode === 13) {
      if (search.val() !== "") {
        inputFunc();
      } else {
        console.log("please enter a city");
      }
    }
  });

  cityBtn.click(function (event) {
    getWeather($(cityBtn).text());
  });
}

// putting functions, methods, and variables to be used within searchEvent into one function
function inputFunc() {
  event.preventDefault();
  cities.push(search.val());
  // setStorage();
  // createCityList();
  getWeather(search.val());
  // console.log(cities);
  search.val("");
}

// function createCityList(city) {
//   console.log(cities);
//   citiesList.append(cityLiEl);
//   cityLiEl.append(cityBtn);
//   cityBtn.text(city);
// }

// ********** localStorage **********

function setStorage() {
  // setting array cities into localStorage above to be a stringified value
  localStorage.setItem("city", JSON.stringify(cities));
}

// creating a function to get tasks from localStorage and place them in the corresponding textarea
function getCities() {
  // cities = JSON.parse(localStorage.getItem("city"));
  // looping through localStorage
  $.each(localStorage, function (key, value) {
    // looping through hours array
    console.log(key, value);
    // createCityList(value);
  });
  // console.log(cities);

  // for (let i = 1; i < cities.length; i++) {
  //   createCityList(cities()[i--]);
  // }
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
    // console.log(response);
    response.json().then(function (data) {
      createCurrentUvi(data);
      // console.log(data);
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
  let iconCode = conditions.list[0].weather[0].icon;
  let iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
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

function createForecast(cityForecast) {
  let forecast = $("<div>").addClass("container w-100");
}

searchEvent();
