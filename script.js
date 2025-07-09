const apiKey = '45a510cacab6c66e47302cc14dd51619';
const heroSection = document.getElementById('hero');
const weatherQuote = document.getElementById('wether-quote');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const LocalTime = document.getElementById('local-time');
const weatherIcon = document.getElementById('wether-icon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('wether-description');

// Wether Specific bg-Image & Quotes

const WeatherStyles = {
    'clear': {
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&h=900&auto=format&fit=crop',
        quote: '"Sunshine is the best medicine."'
    },
    'clouds': {
        image: 'https://images.unsplash.com/photo-1566010503302-2564ae0d47b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        quotes: '"Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky."'
    },
    'rain': {
        image: 'https://images.unsplash.com/photo-1697317432299-56cfba6e98f6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        quote: '"Life isn’t about waiting for the storm to pass, it’s about learning to dance in the rain."'
    },
    'snow': {
        image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1600&h=900&auto=format&fit=crop',
        quote: '"A snowflake is one of nature’s most fragile things, but look what happens when they stick together."'
    },
    'mist': {
        image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1600&h=900&auto=format&fit=crop',
        quote: '"In the mist, the world becomes a dream."'
    },
    'default': {
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600&h=900&auto=format&fit=crop',
        quote: '"Embrace the weather, for it paints the sky with stories."'
    }
}

// Function to Fetch Wether Data
async function FetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        //     Sends a request to the OpenWeather API.

        // Asks for the current weather of the given city.

        // await pauses the function until we get a response from the API.

        // ${city} and ${apiKey} insert values into the URL.

        // units=metric gives temperature in °C.
        if (!response.ok) throw new Error('City is not found');
        //     The response is an HTTP response object returned by the browser's fetch() function. It contains information about the response, like:

        // response.ok → whether the request was successful (status code 200–299)

        // response.status → the HTTP status code (e.g., 200, 404)

        // response.json() → a method to get the actual data in JSON format
        // response.ok is a boolean value (true or false).

        // What does throw mean?
        // throw is used in JavaScript to intentionally cause an error.

        // It stops the normal flow of the program and jumps to the nearest catch block if one exists.
        //  What is new Error('City not found')?
        // Error is a built-in JavaScript object used to create error messages.

        // new Error('City not found') creates a new error with that message.
        const data = await response.json();
        // This converts the response from JSON format (text) into a JavaScript object we can use.
        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

//  Function to Display Wether Data
function displayWeather(data) {
    // This line picks out specific values from the data object
    const { name, main, weather, timezone } = data;
    //    It makes your code cleaner. Instead of writing:


    // const name = data.name;
    // const main = data.main;
    // const weather = data.weather;
    // const timezone = data.timezone;
    // You can just write all in one line:


    // const { name, main, weather, timezone } = data;

    const weatherCondition = weather[0].main.toLowerCase();
    //  What does weather[0].main mean?
    // weather[0] means: the first object inside the array.

    // weather[0].main means: get the "main" value of that object.

    // In this example:

    // weather[0].main === "Rain"

    cityName.textContent = name;
    temperature.textContent = `${main.temp}°C`;
    // | Used In           | What `main` Refers To                     | Type   | Purpose                           |
    // | ----------------- | ----------------------------------------- | ------ | --------------------------------- |
    // | `main.temp`       | The **main object** (temperature info)    | Object | Holds temp, humidity, etc.        |
    // | `weather[0].main` | The **main property** inside `weather[0]` | String | Weather type like "Rain", "Clear" |

    weatherDescription.textContent = weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
    weatherIcon.src = iconUrl;
    //  What does onerror do?
    // onerror is a special event handler used with HTML elements (like <img>) in JavaScript.
    // It runs automatically when an error occurs — for example, when the image fails to load due to a broken link or no internet.
    weatherIcon.onerror = () => {
        weatherIcon.src = 'https://openweathermap.org/img/wn/10d@2x.png';
        console.log(`Failed to load icon : ${iconUrl}`);
    }

    // Here:
    // If the icon URL fails (maybe invalid or the server is down), we set a fallback image (10d.png)

    // We log the failed URL to help with debugging
    weatherIcon.classList.remove('hidden');
    // Removes the hidden class from the icon to make it visible (in case it was hidden initially).
    // Example: Ensures the icon (e.g., sun) appears.

    // this how data came in from fetch api , 
    // {
    //   "name": "Mumbai",
    //   "main": {
    //     "temp": 31.52,
    //     "feels_like": 38.45
    //   },
    //  "weather": [
    //   {
    //     "main": "Clouds",
    //     "description": "scattered clouds",
    //     "icon": "03d"
    //   }
    // ],
    //   "timezone": 19800
    // }

    // Updates Bg image & quotes based on wether.

    const Style = WeatherStyles[weatherCondition] || WeatherStyles['default'];
    // wetherCondition is  on line 96;
    heroSection.style.backgroundImage = `url('${Style.image}')`;
    weatherQuote.textContent = Style.quote;
    // Update Local Time
    updateLocalTime(timezone);
}

// Function to update local time based on timezone offset
function updateLocalTime(timezoneoffset) {
    const update = () => {
        const now = new Date(); //Gets the current time (your system time).
        const UTCtime = now.getTime() + (now.getTimezoneOffset()) * 60000; // now.getTime() gives time in milliseconds.
        // getTimezoneOffset() gives the difference in minutes between UTC and your time.
        // Multiply by 60000 to convert minutes to milliseconds
        const localTime = new Date(UTCtime + (timezoneoffset * 1000));
        LocalTime.textContent = `Local Time : ${localTime.toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
        // This method formats the time into a readable string, based on options you give.

        // You can customize format like hour, minute, AM/PM, etc.

        // 🔧 Inside toLocaleTimeString([], { ... }):
        // 8. [] (empty array)
        // This is for locales, like "en-IN" or "fr-FR".

        // [] means use default locale of the browser.
        // if you leave it as [], it will automatically match the user's system or browser settings — which is best for international use.

        // 9. { hour: '2-digit', minute: '2-digit', hour12: true }
        // These are formatting options:

        // hour: '2-digit' → Always show 2 digits for hour (e.g., 03 instead of 3)

        // minute: '2-digit' → Same for minutes

        // hour12: true → Use 12-hour clock (with AM/PM). If false, shows 24-hour time.
    }
    update();
    setInterval(update, 1000);
}
//  Event Listner For Search Button

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        FetchWeatherData(city);
    } else {
        alert('Enter a valid City Name');
    }
    cityInput.value = '';
});
//  Event listner for Enter Key
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
})