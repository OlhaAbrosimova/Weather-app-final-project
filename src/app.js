function formatDate(timestamp) {
	let date = new Date(timestamp);
	let hours = date.getHours();
	if (hours < 10) {
		hours = `0${hours}`;
	}
	let minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}

	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	let day = days[date.getDay()];

	return `${day}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
	let date = new Date(timestamp * 1000);
	let day = date.getDay();
	let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return days[day];
}
function displayForecast(response) {
	
	let forecast = response.data.daily;
	let forecastElement = document.querySelector("#forecast");

	let forecastHTML = `<div class="row">`;

	forecast.forEach(function (forecastDay, index) {
		if (index < 6) {
			forecastHTML =
				forecastHTML +
				`<div class="col-2">
				<div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
			
				<img
					src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
					alt=""
					width="52"
				/>
				<div class="weather-forecast-temperatures">
					<span class="weather-forecast-temp-max">${Math.round(
						forecastDay.temp.max
					)}° </span>
					<span class="weather-forecast-temp-min">${Math.round(
						forecastDay.temp.min
					)}°</span>
				</div>
			</div>
		
	`;
		}
	});

	forecastHTML = forecastHTML + `</div>`;
	forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
	let apiKey = "a2e58143d5353df7726302c2856b0fb6";
	let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

	axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
	let temperatureElement = document.querySelector("#base-temperature");

	celsiusTemperature = response.data.main.temp;
	temperatureElement.innerHTML = Math.round(celsiusTemperature);
	let cityElement = document.querySelector("#city");
	cityElement.innerHTML = response.data.name;
	let descriptionElement = document.querySelector("#description");
	descriptionElement.innerHTML = response.data.weather[0].description;
	let humidityElement = document.querySelector("#humidity");
	humidityElement.innerHTML = response.data.main.humidity;
	let windElement = document.querySelector("#wind-speed");
	windElement.innerHTML = response.data.wind.speed.toFixed(1);
	let dateElement = document.querySelector("#date");
	dateElement.innerHTML = formatDate(response.data.dt * 1000);
	let iconElement = document.querySelector("#icon");
	iconElement.setAttribute(
		"src",
		`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
	);
	iconElement.setAttribute("alt", response.data.weather[0].description);

	getForecast(response.data.coord);
}

function search(city) {
	let apiKey = "a2e58143d5353df7726302c2856b0fb6";

	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

	axios.get(apiUrl).then(displayTemperature);
}
function handleSubmit(event) {
	event.preventDefault();
	let cityInput = document.querySelector("#city-input");
	search(cityInput.value);
}
search("Kyiv");

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function displayFarenheitTemperature(event) {
	event.preventDefault();
	let temperatureElement = document.querySelector("#base-temperature");
	celsiusLink.classList.remove(`active`);
	farenheitLink.classList.add(`active`);
	let farenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
	temperatureElement.innerHTML = Math.round(farenheitTemperature);
}

let celsiusTemperature = null;

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", displayFarenheitTemperature);

function displayCelsiusTemperature(event) {
	event.preventDefault();
	let temperatureElement = document.querySelector("#base-temperature");
	celsiusLink.classList.add(`active`);
	farenheitLink.classList.remove(`active`);

	temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

// current geolocation
function retrievePosition(position) {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	let apiKey = "a2e58143d5353df7726302c2856b0fb6";
	let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
	let units = "metric";
	let apiUrl = `${apiEndPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

	// axios.get(apiUrl).then(showCurrentWeather);
	axios.get(apiUrl).then(displayTemperature);
}

function getPosition(event) {
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(retrievePosition);
}

let currentGeo = document.querySelector("#current-geo");
currentGeo.addEventListener("click", getPosition);

// function showCurrentWeather(response) {
// 	let curCity = response.data.name;
// 	let city = document.querySelector("#city");
// 	city.innerHTML = `${curCity}`;

// 	let curTemperature = Math.round(response.data.main.temp);
// 	let temperature = document.querySelector("#base-temperature");
// 	temperature.innerHTML = `${curTemperature}`;

// 	let curHumidity = response.data.main.humidity;
// 	let humidity = document.querySelector("#humidity");
// 	humidity.innerHTML = `${curHumidity}`;

// 	let curWind = response.data.wind.speed.toFixed(1);
// 	let wind = document.querySelector("#wind-speed");
// 	wind.innerHTML = `${curWind}`;
// }
