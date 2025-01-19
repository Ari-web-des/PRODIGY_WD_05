document.getElementById("fetchWeather").addEventListener("click", fetchWeather);

function fetchWeather() {
   
    const dropdownCity = document.getElementById("cityDropdown").value;
    
    
    const customCity = document.getElementById("customCityInput").value;

    
    const city = customCity.trim() !== "" ? customCity : dropdownCity;

    if (city === "") {
        alert("Please select or enter a city name!");
        return;
    }
    const apiKey = "2ce579d81aa7974cca78a0de01e7177e"; 
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                alert("City not found. Please check the name and try again.");
                return;
            }

            const { name, timezone } = data;
            const { main, description, icon } = data.weather[0];
            const { temp, humidity } = data.main;
            const { speed } = data.wind;

            document.getElementById("cityName").textContent = name;
            document.getElementById("description").textContent = description;
            document.getElementById("temperature").textContent = temp.toFixed(1);
            document.getElementById("humidity").textContent = humidity;
            document.getElementById("windSpeed").textContent = speed.toFixed(1);
            document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            updateLocalTime(timezone);

            changeBackground(main);

            gsap.from(".weather-info", { opacity: 0, y: -50, duration: 1 });
        })
        .catch(err => {
            console.error(err);
            alert("Unable to fetch weather data. Please check the city name.");
        });
}
let timeUpdateInterval; 

function updateLocalTime(timezoneOffset) {
    
    if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval);
    }

  
    const timezoneInHours = timezoneOffset / 3600;

   
    timeUpdateInterval = setInterval(() => {
        const now = new Date();
        const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
        const localTime = new Date(utcTime + timezoneInHours * 3600000);

        // Format the time using Intl.DateTimeFormat
        const formattedTime = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(localTime);

        // Update the DOM
        document.getElementById("localTime").textContent = formattedTime;
    }, 1000);
}

function changeBackground(weather) {
    const body = document.body;
    let backgroundStyle;

    switch (weather.toLowerCase()) {
        case "clear":
            backgroundStyle = "linear-gradient(to bottom, #87ceeb, #ffe47a)";
            break;
        case "clouds":
            backgroundStyle = "linear-gradient(to bottom, #d3d3d3, #a9a9a9)";
            break;
        case "rain":
        case "drizzle":
            backgroundStyle = "linear-gradient(to bottom, #5f9ea0, #2f4f4f)";
            break;
        case "thunderstorm":
            backgroundStyle = "linear-gradient(to bottom, #1f1c2c, #928dab)";
            break;
        case "snow":
            backgroundStyle = "linear-gradient(to bottom, #ffffff, #c0c0c0)";
            break;
        case "mist":
        case "haze":
        case "fog":
            backgroundStyle = "linear-gradient(to bottom, #d6d6d6, #f5f5f5)";
            break;
        default:
            backgroundStyle = "linear-gradient(to bottom, #87ceeb, #f0f8ff)"; // Default
    }

    body.style.background = backgroundStyle;
    body.style.transition = "background 0.5s ease";
}
// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// Check user preference from localStorage
if (localStorage.getItem("darkMode") === "enabled") {
    enableDarkMode();
    darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function enableDarkMode() {
    body.classList.add("dark-mode");
    document.querySelector(".header").classList.add("dark-mode");
    document.querySelector(".city-input").classList.add("dark-mode");
    document.querySelector(".btn").classList.add("dark-mode");
    document.querySelector(".weather-info").classList.add("dark-mode");
    document.querySelector("footer").classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
}

function disableDarkMode() {
    body.classList.remove("dark-mode");
    document.querySelector(".header").classList.remove("dark-mode");
    document.querySelector(".city-input").classList.remove("dark-mode");
    document.querySelector(".btn").classList.remove("dark-mode");
    document.querySelector(".weather-info").classList.remove("dark-mode");
    document.querySelector("footer").classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
}
