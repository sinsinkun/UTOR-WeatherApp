const apiKey = process.env.OWM_KEY;

// Load in saved locations
let cityList = localStorage.cityList ? JSON.parse(localStorage.cityList): [];
if (cityList.length > 0) {
    document.querySelector('#searchRow').classList.remove('d-none');
    document.querySelector('#resetRow').classList.remove('d-none');
    for (let i=0; i<cityList.length; i++) {
        document.querySelector('#searchList').innerHTML +=
        `<li><button type="button" class="btn btn-link" onclick=pastSearch('${cityList[i]}')>${cityList[i]}</button></li>`;
    }
}

// Bind functions to HTML
document.querySelector('#searchVar').addEventListener('keypress', (e) => onKeyPress(e));
document.querySelector('#resetList').addEventListener('click', resetList);

// search bar search
async function onKeyPress(e) {
    if (e.key === 'Enter') {

        let searchVar = encodeURI(document.querySelector('#searchVar').value);
        searchVar = searchVar[0].toUpperCase() + searchVar.substring(1);
        // display history
        document.querySelector('#searchRow').classList.remove('d-none');
        document.querySelector('#resetRow').classList.remove('d-none');
        // send API request
        let errCaught = false;
        let weather = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${searchVar}&appid=${apiKey}`)
        .then( r => r.json()).catch((error) => {
            console.error('Error:', error);
            errCaught = true;
        });
        if (Object.keys(weather).length > 0) handleWeather(weather);
        let forecast = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${searchVar}&appid=${apiKey}`)
        .then( r => r.json()).catch((error) => {
            console.error('Error:', error);
            errCaught = true;
        });
        if (Object.keys(forecast).length > 0) handleForecast(forecast);
        if (errCaught) alert('Could not find city. Please try again.');
        // check if entry already in list
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
            `<li><button type="button" class="btn btn-link" onclick=pastSearch('${searchVar}')>${searchVar}</button></li>`;
            localStorage.cityList = JSON.stringify(cityList);
        }
    }
}

function handleWeather(obj) {
    // print to HTML
    console.log(obj);
    document.querySelector('#cityName').innerHTML = `${obj.name}, ${obj.sys.country}'s `;
    document.querySelector('#weatherInfo').innerHTML =
    `<li>Weather: ${obj.weather[0].main}</li>
    <li>Temperature: ${(obj.main.temp-273.15).toFixed(2)}&#176;C</li>
    <li>Humidity: ${obj.main.humidity}%</li>
    <li>Pressure: ${obj.main.pressure/10} kPa</li>`;
    document.querySelector('#weatherIcon').innerHTML =
    `<img src="http://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png" alt="weather icon" />`;
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
                    <img src="http://openweathermap.org/img/wn/${obj.list[i].weather[0].icon}@2x.png" alt="weather icon"/>
                    <p class="card-text">${obj.list[i].weather[0].main}</p>
                    <p class="card-text">${(obj.list[i].main.temp-273.15).toFixed(2)}&#176;C</p>
                </div>
            </div>
        </div>`;
    }
}

async function pastSearch(btn) {
    // send API request
    let weather = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${btn}&appid=${apiKey}`)
    .then( r => r.json()).catch((error) => {
        console.error('Error:', error);
        alert('Could not find city. Please try again.');
    });
    if (Object.keys(weather).length > 0) handleWeather(weather);
    let forecast = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${btn}&appid=${apiKey}`)
    .then( r => r.json()).catch((error) => {
        console.error('Error:', error);
    });
    if (Object.keys(forecast).length > 0) handleForecast(forecast);
}

function resetList() {
    localStorage.removeItem('cityList');
    document.querySelector('#searchList').innerHTML = '';
}