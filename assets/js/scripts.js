let search = $(".search");

let searchBtn = $(".searchBtn");
let citiesList = $(".cities");
let cityLiEl = $("<li>").addClass("list-group-item");
let cityBtn = $("<button>").addClass(
  "cityBtn btn btn-outline-secondary d-flex w-100"
);
let cities = [];

let currentCity = $("#currentCity");
let currentDate = $("<span>");
let currentIcon = $("<img>");
let currentTemp = $("#currentTemp");
let currentHumidity = $("#currentHumidity");
let currentWind = $("#currentWind");
let currentUVI = $("#currentUVI");
let forecast = $("#forecast");

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

// ********** Current Weather Conditions **********

function createCurrentConditions(conditions, city) {
  // Creating
  currentCity.text(conditions.city.name);

  currentDate.text(` (${moment(conditions.list.dt_txt).format("M/D/YYYY")})`);
  currentCity.append(currentDate);

  let iconCode = conditions.list[0].weather[0].icon;
  let iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  currentIcon.attr("src", iconUrl);
  currentCity.append(currentIcon);
}

function createForecast(city) {}

searchEvent();
