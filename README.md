# 06 Server-Side APIs: Weather Dashboard

Takes advantage of the [OpenWeather API](https://openweathermap.org/api) to retrieve and display
weather data for cities across the world. Will also save search history for ease of use.

## Link to Live Website

https://sinsinkun.github.io/UTOR-WeatherApp

## Screenshot

![Screenshot](./screenshot.png)

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```