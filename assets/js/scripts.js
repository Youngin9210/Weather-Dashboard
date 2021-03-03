let search = $(".search");

let searchBtn = $(".searchBtn");
let citiesList = $(".cities");
let cityLiEl = $("<li>").addClass("list-group-item");
let cityBtn = $("<button>").addClass(
  "cityBtn btn btn-outline-secondary d-flex w-100"
);
let citySearch = [];

function createCityList() {
  citiesList.append(cityLiEl);
  cityLiEl.append(cityBtn);
  cityBtn.text(search.val());
}

// putting functions, methods, and variables to be used within searchEvent into one function
function inputFunc() {
  event.preventDefault();
  let searchVal = search.val();
  createCityList();
  citySearch.push(searchVal);
  setStorage();
  getWeather(searchVal);
  console.log(citySearch);
  search.val("");
}

// function to be called on later to implement a click event on saveBtn
function searchEvent() {
  // adding a click event to searchBtn
  searchBtn.click(function (event) {
    inputFunc();
  });

  // adding a keypress event on the search input
  $(search).keypress(function (event) {
    let keyCode = event.keyCode;
    if (keyCode === 13) {
      inputFunc();
    }
  });
}

function setStorage() {
  // setting array cities into localStorage above to be a stringified value
  localStorage.setItem("city", JSON.stringify(citySearch));
}

function getWeather(city) {
  let apiKey = "6d2d2840d31a11364a7bbe1cba528b23";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data, city);
    });
  });
}

searchEvent();
