// weather.js

/*
Use fetch to call this free API (no auth required):
  https://api.open-meteo.com/v1/forecast?latitude=14.6&longitude=121.0&current_weather=true

Use async/await. Inside an async function:
• Call fetch with the URL
• Await response.json() to parse the JSON
• Print the current_weather object
• Wrap everything in try/catch and print any errors

*/

const weatherAPI = 'https://api.open-meteo.com/v1/forecast?latitude=14.6&longitude=121.0&current_weather=true';

async function getWeather() {
    try {
        const response = await fetch(weatherAPI);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.current_weather);
    } catch (err) {
        console.error("Error fetching weather data:", err);
    }
}

getWeather();