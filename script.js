const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');

function getWeather() {
    const city = cityInput.value;
    
    fetch(`https://wttr.in/${city}?format=j1`)
        .then(response => response.json())
        .then(data => {
            const currentCondition = data.current_condition[0];
            const weatherHtml = `
                <h2>${data.nearest_area[0].areaName[0].value}, ${data.nearest_area[0].country[0].value}</h2>
                <p>Temperature: ${currentCondition.temp_C}°C / ${currentCondition.temp_F}°F</p>
                <p>Condition: ${currentCondition.weatherDesc[0].value}</p>
                <p>Humidity: ${currentCondition.humidity}%</p>
                <p>Wind: ${currentCondition.windspeedKmph} km/h</p>
            `;
            weatherInfo.innerHTML = weatherHtml;
        })
        .catch(error => {
            weatherInfo.innerHTML = 'Error fetching weather data. Please try again.';
            console.error('Error:', error);
        });
}

cityInput.addEventListener('input', debounce(autocompleteCity, 300));

function autocompleteCity() {
    const city = cityInput.value;
    const autocompleteList = document.getElementById('autocomplete-list') || createAutocompleteList();
    
    if (city.length < 3) {
        autocompleteList.innerHTML = '';
        return;
    }

    fetch(`https://wttr.in/:cities/${city}`)
        .then(response => response.text())
        .then(data => {
            const cities = data.split('\n').filter(Boolean);
            autocompleteList.innerHTML = cities
                .map(city => `<div>${city}</div>`)
                .join('');
            
            autocompleteList.querySelectorAll('div').forEach(item => {
                item.addEventListener('click', function() {
                    cityInput.value = this.textContent;
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