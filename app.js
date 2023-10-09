import { apiKey } from "./apikey.js";
let searchForm = document.querySelector(".search-form");


(function () {
  let latLon = [41.8755616, -87.6244212];
  callApi(latLon);
}());

function handleSubmit(e) {
  e.preventDefault();
  let myForm = new FormData(e.target);
  for (const [key, value] of myForm) {
    getLatLon(value);
  }
}

function getLatLon(city) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
  )
    .then((res) => {
      if (res.ok === false) {
        throw new Error("Invalid location");
      }
      return res.json();
    })
    .then((data) => {
      JSON.stringify(data);
      let latLon = [];
      latLon.push(data[0].lat);
      latLon.push(data[0].lon);
      callApi(latLon);
    })
    .catch((error) => invalidLocation())
}

function callApi(latLon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latLon[0]}&lon=${latLon[1]}&appid=${apiKey}&units=imperial&lang={en}`
  )
    .then((res) => res.json())
    .then((data) => {
      JSON.stringify(data);
      updateScreen(data);
    });
}

function updateScreen(data) {
  let imgSrc = `./images/${data.weather[0].main}.png`;
  document.querySelector(".weather-img").src = imgSrc;
  document.querySelector(".display-temp h1").innerText =
    Math.round(data.main.temp) + "°F";
  document.querySelector(".display-location h2").innerText = data.name;
  document.querySelector(".humidity-percent").innerText =
    data.main.humidity + "%";
  document.querySelector(".high-today").innerText =
    Math.round(data.main.temp_max) + "°F";
}

function invalidLocation() {
  document.querySelector(".invalid-location").style.display = "block";
  setTimeout(refreshForm, 5000);
}

function refreshForm() {
  searchForm.reset();
  document.querySelector(".invalid-location").style.display = "none";
}

searchForm.addEventListener("submit", handleSubmit);
