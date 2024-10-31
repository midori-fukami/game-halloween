// weather.js

let currentWeather = "clear";
let weatherIntensity = 0;
let weatherEffect = null;

function createWeatherEffect() {
    if (weatherEffect) {
        destroy(weatherEffect);
    }

    if (currentWeather === "fog") {
        weatherEffect = add([
            rect(width(), height()),
            color(200, 200, 200),
            opacity(0),
            fixed(),
            z(100),
            "weatherEffect"
        ]);
    } else if (currentWeather === "rain") {
        weatherEffect = add([
            rect(width(), height()),
            color(0, 0, 200),
            opacity(0),
            fixed(),
            z(100),
            "weatherEffect"
        ]);
    }
}

function updateWeather() {
    if (rand(0, 1000) < 5) { // 0.5% chance to change weather each frame
        currentWeather = choose(["clear", "fog", "rain"]);
        weatherIntensity = rand(0.2, 0.6); // Reduced max intensity for better visibility
        createWeatherEffect();
    }

    if (weatherEffect) {
        weatherEffect.opacity = weatherIntensity * 0.5; // Adjust this multiplier to control overall opacity
    }
}

function getVisibilityFactor() {
    if (currentWeather === "clear") return 1;
    return 1 - (weatherIntensity * 0.3);
}

function getGhostSpeedFactor() {
    if (currentWeather === "rain") return 1 - (weatherIntensity * 0.3);
    return 1;
}

function clearWeather() {
    if (weatherEffect) {
        destroy(weatherEffect);
        weatherEffect = null;
    }
    currentWeather = "clear";
    weatherIntensity = 0;
}
