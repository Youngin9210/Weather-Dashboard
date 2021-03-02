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

// function to be called on later to implement a click event on saveBtn
function searchBtnClick() {
  // adding a click event to searchBtn
  searchBtn.click(function (event) {
    // preventing default action
    event.preventDefault();
    createCityList();
    setStorage();
    console.log(search.val());
  });

  // adding a keypress event on the search input
  $(search).keypress(function (event) {
    let keyCode = event.keyCode;
    if (keyCode === 13) {
      event.preventDefault();
      setStorage();
      console.log(search.val());
    }
  });
}

function setStorage() {
  // defining a variable to be used as the key value
  let city = $(search).val();

  // setting items into localStorage using city defined above to be a stringified value
  localStorage.setItem("City", JSON.stringify(city));
}

searchBtnClick();
