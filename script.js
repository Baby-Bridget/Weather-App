const API_KEY = 79ca883f502dc1d597593ca0665c7c0e 
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const form = document.querySelector("form");
const input = document.querySelector("#city");
const weatherContainer = document.querySelector(".weather");
const loadingText = document.querySelector(".loading");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return alert("Please enter a city name");

  loadingText.textContent = "Loading...";
  weatherContainer.innerHTML = "";

  try {
    const response = await fetch(${API_URL}?q=${city}&appid=${API_KEY}&units=metric);
    const data = await response.json();

    if (data.cod !== 200) {
      loadingText.textContent = "City not found 😕";
      return;
    }

    const icon = data.weather[0].icon;
    const description = data.weather[0].description;
    const temp = data.main.temp;
    const name = data.name;
    const country = data.sys.country;

    weatherContainer.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
      <h2>${name}, ${country}</h2>
      <p>${temp}°C</p>
      <p>${description}</p>
    `;
    loadingText.textContent = "";
  } catch (error) {
    loadingText.textContent = "Error fetching weather data 😞";
    console.error(error);
  }
});