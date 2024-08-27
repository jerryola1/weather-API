const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const forecast = document.getElementById('forecast');

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

cityInput.addEventListener('input', debounce(autocompleteCity, 300));

function autocompleteCity() {
    const input = cityInput.value.toLowerCase();
    if (input.length < 2) {
        const autocompleteList = document.getElementById('autocomplete-list');
        if (autocompleteList) {
            autocompleteList.innerHTML = '';
        }
        return;
    }

    fetch('cities.json')
        .then(response => response.json())
        .then(cities => {
            const matchedCities = cities.filter(city => 
                city.name.toLowerCase().includes(input) || 
                city.country.toLowerCase().includes(input)
            ).slice(0, 5);

            const autocompleteList = document.getElementById('autocomplete-list') || createAutocompleteList();
            autocompleteList.innerHTML = matchedCities
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

// function autocompleteCity() {
//     const input = cityInput.value.toLowerCase();
//     if (input.length < 2) {
//         const autocompleteList = document.getElementById('autocomplete-list');
//         if (autocompleteList) {
//             autocompleteList.innerHTML = '';
//         }
//         return;
//     }

//     fetch(`get_cities.php?input=${encodeURIComponent(input)}`)
//         .then(response => response.json())
//         .then(data => {
//             const cities = data.data || [];
//             const autocompleteList = document.getElementById('autocomplete-list') || createAutocompleteList();
//             autocompleteList.innerHTML = cities
//                 .map(city => `<div>${city.name}, ${city.country}</div>`)
//                 .join('');
            
//             autocompleteList.querySelectorAll('div').forEach(item => {
//                 item.addEventListener('click', function() {
//                     cityInput.value = this.textContent.split(',')[0]; // Only use the city name
//                     autocompleteList.innerHTML = '';
//                     getWeather();
//                 });
//             });
//         })
//         .catch(error => console.error('Error:', error));
// }


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

function getWeatherIcon(code) {
    const iconMap = {
        '113': 'fa-sun',
        '116': 'fa-cloud-sun',
        '119': 'fa-cloud',
        '122': 'fa-cloud',
        '143': 'fa-smog',
        '176': 'fa-cloud-rain',
        '179': 'fa-snowflake',
        '182': 'fa-cloud-rain',
        '185': 'fa-cloud-rain',
        '200': 'fa-bolt',
        '227': 'fa-snowflake',
        '230': 'fa-snowflake',
        '248': 'fa-fog',
        '260': 'fa-fog',
        '263': 'fa-cloud-rain',
        '266': 'fa-cloud-rain',
        '281': 'fa-cloud-rain',
        '284': 'fa-cloud-rain',
        '293': 'fa-cloud-rain',
        '296': 'fa-cloud-rain',
        '299': 'fa-cloud-showers-heavy',
        '302': 'fa-cloud-showers-heavy',
        '305': 'fa-cloud-showers-heavy',
        '308': 'fa-cloud-showers-heavy',
        '311': 'fa-cloud-rain',
        '314': 'fa-cloud-rain',
        '317': 'fa-cloud-rain',
        '320': 'fa-cloud-rain',
        '323': 'fa-snowflake',
        '326': 'fa-snowflake',
        '329': 'fa-snowflake',
        '332': 'fa-snowflake',
        '335': 'fa-snowflake',
        '338': 'fa-snowflake',
        '350': 'fa-snowflake',
        '353': 'fa-cloud-rain',
        '356': 'fa-cloud-showers-heavy',
        '359': 'fa-cloud-showers-heavy',
        '362': 'fa-cloud-rain',
        '365': 'fa-cloud-rain',
        '368': 'fa-snowflake',
        '371': 'fa-snowflake',
        '374': 'fa-cloud-rain',
        '377': 'fa-cloud-rain',
        '386': 'fa-bolt',
        '389': 'fa-bolt',
        '392': 'fa-snowflake',
        '395': 'fa-snowflake'
    };
    return iconMap[code] || 'fa-question';
}

// Add event listener to the search button
document.querySelector('.search-button').addEventListener('click', getWeather);
