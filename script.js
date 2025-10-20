// Bright Weather App - search by city name
const API_KEY = 'YOUR_API_KEY_HERE'; // <-- Replace with your OpenWeatherMap API key
const BASE = 'https://api.openweathermap.org/data/2.5/weather';

const form = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const result = document.getElementById('result');
const cityName = document.getElementById('cityName');
const description = document.getElementById('description');
const tempValue = document.getElementById('tempValue');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const errorBox = document.getElementById('error');
const loading = document.getElementById('loading');
const toggleUnit = document.getElementById('toggleUnit');
const unitLabel = document.getElementById('unitLabel');
const useLastBtn = document.getElementById('useLast');
const lastCitySpan = document.getElementById('lastCity');

let unit = localStorage.getItem('unit') || 'metric'; // 'metric' or 'imperial'
updateUnitUI();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeather(city);
});

toggleUnit.addEventListener('click', (e) => {
  e.preventDefault();
  unit = (unit === 'metric') ? 'imperial' : 'metric';
  localStorage.setItem('unit', unit);
  updateUnitUI();
  const last = localStorage.getItem('lastCity');
  if (last) fetchWeather(last);
});

useLastBtn.addEventListener('click', (e) => {
  const last = localStorage.getItem('lastCity');
  if (last) fetchWeather(last);
});

function updateUnitUI() {
  toggleUnit.textContent = unit === 'metric' ? '°C' : '°F';
  unitLabel.textContent = unit === 'metric' ? '°C' : '°F';
}

function showError(msg){
  if(!msg){ errorBox.classList.add('hidden'); errorBox.textContent=''; return; }
  errorBox.classList.remove('hidden');
  errorBox.textContent = msg;
}

function showLoading(show){
  loading.classList.toggle('hidden', !show);
}

function showResult() {
  result.classList.remove('hidden');
}
function hideResult() {
  result.classList.add('hidden');
}

function capitalize(s) {
  if(!s) return '';
  return s.split(' ').map(w => w[0].toUpperCase()+w.slice(1)).join(' ');
}

async function fetchWeather(city) {
  showError('');
  hideResult();
  showLoading(true);
  try {
    const url = ${BASE}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit};
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) throw new Error('City not found');
      throw new Error('Failed to fetch weather');
    }
    const data = await res.json();
    cityName.textContent = ${data.name}, ${data.sys.country};
    description.textContent = capitalize(data.weather[0].description);
    tempValue.textContent = Math.round(data.main.temp);
    humidity.textContent = Humidity: ${data.main.humidity}%;
    wind.textContent = Wind: ${Math.round(data.wind.speed)} ${unit === 'metric' ? 'm/s' : 'mph'};
    weatherIcon.src = https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png;
    weatherIcon.alt = data.weather[0].description;
    showResult();
    localStorage.setItem('lastCity', data.name);
    lastCitySpan.textContent = data.name;
    useLastBtn.classList.remove('hidden');
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

// load last city on start
const last = localStorage.getItem('lastCity');
if (last) {
  lastCitySpan.textContent = last;
  useLastBtn.classList.remove('hidden');
}