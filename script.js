const apiKey = '88547ae129179c5b0317315ddf40567c';

// Load in saved locations
let cityList = localStorage.cityList ? JSON.parse(localStorage.cityList): [];
if (cityList.length > 0) {
    document.querySelector('#searchRow').classList.remove('d-none');
    document.querySelector('#resetRow').classList.remove('d-none');
    for (let i=0; i<cityList.length; i++) {
        document.querySelector('#searchList').innerHTML +=
        `<li><button type="button" class="btn btn-link" onclick=queryAPI('${cityList[i]}')>${cityList[i]}</button></li>`;
    }
}

// Bind functions to HTML
document.querySelector('#searchVar').addEventListener('keypress', (e) => onKeyPress(e));
document.querySelector('#resetList').addEventListener('click', resetList);

// search bar search
async function onKeyPress(e) {
    if (e.key === 'Enter') {
        let searchVar = document.querySelector('#searchVar').value;
        searchVar = searchVar[0].toUpperCase() + searchVar.substring(1);
        // display history
        document.querySelector('#searchRow').classList.remove('d-none');
        document.querySelector('#resetRow').classList.remove('d-none');
        // send API request
        queryAPI(searchVar);
        // check if entry already in past search list
        let entryExist = false;
        for (let i=0; i<cityList.length; i++) {
            if (searchVar === cityList[i]) {
                entryExist = true;
                break;
            }
        }
        // save to list
        if (!entryExist) {
            cityList.push(searchVar);
            document.querySelector('#searchList').innerHTML +=
            `<li><button type="button" class="btn btn-link" onclick=queryAPI('${searchVar}')>${searchVar}</button></li>`;
            localStorage.cityList = JSON.stringify(cityList);
        }
    }
}

async function queryAPI(city) {
    // send API request
    let lat='', lon='';
    let errCaught = false, errCode='', errMessage='';
    let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then( r => r.json());
    if (weather.cod == 200) {
        handleWeather(weather);
        lat = weather.coord.lat;
        lon = weather.coord.lon;
    }
    else {
        errCode = weather.cod;
        errMessage = weather.message;
        errCaught = true;
    }
    let uvInfo = await fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then( r => r.json()).catch(() => console.error('UV Info Error'));
    if (uvInfo) handleUV(uvInfo);
    let forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    .then( r => r.json())
    if (forecast.cod == 200) handleForecast(forecast);
    else {
        errCode = forecast.cod;
        errMessage = forecast.message;
        errCaught = true;
    }
    // Handle error
    if (errCaught) alert(`Error ${errCode}: ${errMessage}`);
}

function handleWeather(obj) {
    // print to HTML
    document.querySelector('#cityName').innerHTML = `${obj.name}, ${obj.sys.country}'s `;
    document.querySelector('#weatherInfo').innerHTML =
    `<li>Weather: ${obj.weather[0].main}</li>
    <li>Temperature: ${(obj.main.temp-273.15).toFixed(2)}&#176;C</li>
    <li>Humidity: ${obj.main.humidity}%</li>
    <li>Pressure: ${obj.main.pressure/10} kPa</li>
    <li>Wind Speed: ${obj.wind.speed} m/s</li>`;
    document.querySelector('#weatherIcon').innerHTML =
    `<img src="https://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png" alt="weather icon" />`;
}

function handleUV(uvInfo) {
    let output, color;
    if (uvInfo.value < 2.5) {output = 'low'; color='green';}
    else if (uvInfo.value < 5.5) {output = 'moderate'; color='orange';}
    else if (uvInfo.value < 8) {output = 'high'; color='red';}
    else {output='very high'; color='purple';}
    document.querySelector('#weatherInfo').innerHTML +=
    `<li>UV Index: <b style='color:${color}'>${output}</b></li>`;
}

function handleForecast(obj) {
    // print to HTML
    document.querySelector('#forecastHead').classList.remove('d-none');
    document.querySelector('#forecastInfo').innerHTML = '';
    for (let i=4; i<37; i+=8) {
        document.querySelector('#forecastInfo').innerHTML +=
        `<div class="col-6 col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${obj.list[i].dt_txt.split(" ",1)}</h5>
                    <img src="https://openweathermap.org/img/wn/${obj.list[i].weather[0].icon}@2x.png" alt="weather icon"/>
                    <p class="card-text">${obj.list[i].weather[0].main}</p>
                    <span class="card-text">Temperature: ${(obj.list[i].main.temp-273.15).toFixed(2)}&#176;C</span>
                    <span class="card-text">Humidity: ${obj.list[i].main.humidity}%</span>
                </div>
            </div>
        </div>`;
    }
}

function resetList() {
    localStorage.removeItem('cityList');
    document.querySelector('#searchList').innerHTML = '';
}