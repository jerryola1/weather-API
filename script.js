const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const forecast = document.getElementById('forecast');

// Replace 'YOUR_RAPIDAPI_KEY' with your actual RapidAPI key
const rapidApiKey = '502d9644d4msh828e69e3f9a20a2p1aac30jsn835d8cf4e62d';

// const cities = [
//     "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
//     "London", "Birmingham", "Leeds", "Glasgow", "Sheffield", "Bradford", "Liverpool", "Edinburgh", "Manchester", "Bristol",
//     "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille",
//     "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kawasaki", "Kyoto", "Saitama",
//     "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Tianjin", "Xi'an", "Chongqing", "Hangzhou", "Nanjing",
//     "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
//     "São Paulo", "Rio de Janeiro", "Salvador", "Brasília", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre",
//     "Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez", "Zapopan", "Mérida", "Cancún",
//     "Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said", "Suez", "Luxor", "Mansoura", "Tanta", "Asyut",
//     "Lagos", "Kano", "Ibadan", "Kaduna", "Port Harcourt", "Benin City", "Maiduguri", "Zaria", "Aba", "Jos"
// ];

function getWeather() {
    const city = cityInput.value;
    
    fetch(`https://wttr.in/${city}?format=j1`)
        .then(response => response.json())
        .then(data => {
            const currentCondition = data.current_condition[0];
            const weatherHtml = `
                <h2>${data.nearest_area[0].areaName[0].value}, ${data.nearest_area[0].country[0].value}</h2>
                <div class="temperature">${currentCondition.temp_C}°C</div>
                <div class="condition">${currentCondition.weatherDesc[0].value}</div>
                <div class="weather-details">
                    <div>
                        <i class="fas fa-wind"></i>
                        <p>${currentCondition.windspeedKmph} km/h</p>
                    </div>
                    <div>
                        <i class="fas fa-tint"></i>
                        <p>${currentCondition.humidity}%</p>
                    </div>
                    <div>
                        <i class="fas fa-cloud-rain"></i>
                        <p>${currentCondition.precipMM} mm</p>
                    </div>
                </div>
            `;
            weatherInfo.innerHTML = weatherHtml;

            const forecastHtml = data.weather.slice(0, 3).map(day => `
                <div class="forecast-day">
                    <div class="day">${new Date(day.date).toLocaleDateString('en-US', {weekday: 'short'})}</div>
                    <i class="fas ${getWeatherIcon(day.hourly[4].weatherCode)}"></i>
                    <div class="temp">${day.avgtempC}°C</div>
                </div>
            `).join('');
            forecast.innerHTML = forecastHtml;
        })
        .catch(error => {
            weatherInfo.innerHTML = 'Error fetching weather data. Please try again.';
            console.error('Error:', error);
        });
}

function getWeatherIcon(code) {
    // Weather icon mapping remains the same
    // ...
}

cityInput.addEventListener('input', debounce(autocompleteCity, 300));

function autocompleteCity() {
    const input = cityInput.value;
    if (input.length < 3) {
        return;
    }

    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${input}&limit=5&sort=-population`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            const autocompleteList = document.getElementById('autocomplete-list') || createAutocompleteList();
            autocompleteList.innerHTML = data.data
                .map(city => `<div>${city.name}, ${city.country}</div>`)
                .join('');
            
            autocompleteList.querySelectorAll('div').forEach(item => {
                item.addEventListener('click', function() {
                    cityInput.value = this.textContent.split(',')[0]; // Only use the city name
                    autocompleteList.innerHTML = '';
                    getWeather();
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function createAutocompleteList() {
    const list = document.createElement('div');
    list.id = 'autocomplete-list';
    list.className = 'autocomplete-items';
    cityInput.parentNode.appendChild(list);
    return list;
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

document.addEventListener('click', function(e) {
    const autocompleteList = document.getElementById('autocomplete-list');
    if (autocompleteList && e.target !== cityInput && !autocompleteList.contains(e.target)) {
        autocompleteList.innerHTML = '';
    }
});

cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});
