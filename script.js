document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '45a510cacab6c66e47302cc14dd51619';
  const heroSection = document.getElementById('hero');
  const weatherQuote = document.getElementById('weather-quote');
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');
  const cityName = document.getElementById('city-name');
  const localTime = document.getElementById('local-time');
  const weatherIcon = document.getElementById('weather-icon');
  const weatherIconContainer = document.getElementById('weather-icon-container');
  const temperature = document.getElementById('temperature');
  const weatherDescription = document.getElementById('weather-description');
  const humidityElement = document.getElementById('humidity');
  const windSpeedElement = document.getElementById('wind-speed');
  const weatherInfo = document.getElementById('weather-info');
  const forecastElement = document.getElementById('forecast');

  let currentSlideInterval = null;
  let timeUpdateInterval = null;

  const weatherStyles = {
    'sunny': {
      quote: '"Sunshine is the best medicine."',
      bgColor: 'bg-gradient-to-br from-yellow-200 to-orange-300',
      animation: 'sunny-glow'
    },
    'clouds': {
      quote: '"Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky."',
      bgColor: 'bg-gradient-to-br from-gray-200 to-gray-400',
      animation: 'cloud-drift'
    },
    'rain': {
      quote: '"Life isn\'t about waiting for the storm to pass, it\'s about learning to dance in the rain."',
      bgColor: 'bg-gradient-to-br from-blue-200 to-blue-500',
      animation: 'rain-effect'
    },
    'stormy': {
      quote: '"Thunderstorms are like the tantrums of nature - loud, dramatic, but ultimately cleansing."',
      bgColor: 'bg-gradient-to-br from-gray-700 to-gray-900',
      animation: 'lightning-flash'
    },
    'snowy': {
      quote: '"A snowflake is one of nature\'s most fragile things, but look what happens when they stick together."',
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-300',
      animation: 'snowfall'
    },
    'mist': {
      quote: '"In the mist, the world becomes a dream."',
      bgColor: 'bg-gradient-to-br from-gray-300 to-gray-500',
      animation: 'mist-fade'
    },
    'default': {
      quote: '"Embrace the weather, for it paints the sky with stories."',
      bgColor: 'bg-gradient-to-br from-blue-200 to-blue-400',
      animation: ''
    }
  };

  const Slides = {
    'sunny': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80'
    ],
    'clouds': [
      'https://images.unsplash.com/photo-1566010503302-2564ae0d47b6?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1670258421086-338921eda8a2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0'
    ],
    'rain': [
      'https://images.unsplash.com/photo-1697317432299-56cfba6e98f6?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80',
      'https://media.istockphoto.com/id/498063665/photo/rainy-landscape.jpg?s=612x612&w=0&k=20&c=2KhHJguvlQvd83c-CJeOiuEKI323gbtSIf1n2sNdXJc='
    ],
    'stormy': [
      'https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    'snowy': [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80',
      'https://images.stockcake.com/public/3/1/2/31234741-3165-4925-b068-a0788f4def63_large/snowy-city-street-stockcake.jpg'
    ],
    'mist': [
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80',
      'https://images.stockcake.com/public/0/3/b/03b30504-8aa9-4bac-bc21-d4d9a2c66324_large/foggy-city-skyline-stockcake.jpg'
    ],
    'default': [
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80'
    ]
  };

  function startBackgroundSlideshow(weatherType) {
    if (currentSlideInterval) {
      clearInterval(currentSlideInterval);
    }

    // Get images for this weather type - fall back to default if none found
    let images = Slides[weatherType] || Slides['default'];
    
    // Final fallback if even default is empty
    if (!images || images.length === 0) {
      console.error('No images available');
      return;
    }

    let currentIndex = 0;
    
    const setBackground = () => {
      const img = new Image();
      img.onload = () => {
        heroSection.style.backgroundImage = `url('${images[currentIndex]}')`;
      };
      img.onerror = () => {
        console.error('Failed to load image:', images[currentIndex]);
        // Try next image in sequence
        currentIndex = (currentIndex + 1) % images.length;
        setBackground();
      };
      img.src = images[currentIndex];
    };

    // Set initial background
    setBackground();

    // Cycle through images
    currentSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setBackground();
    }, 5000);
  }

  async function fetchWeatherData(city) {
    try {
      // Show loading state
      weatherInfo.classList.add('hidden');
      forecastElement.innerHTML = '';
      cityInput.disabled = true;
      searchBtn.disabled = true;
      searchBtn.textContent = 'Loading...';
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) throw new Error('City not found');
      
      const data = await response.json();
      displayWeather(data);
      
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=5`
      );
      if (forecastResponse.ok) {
        displayForecast(await forecastResponse.json());
      }
      cityInput.value = '';
    } catch (error) {
      alert(error.message);
       forecastElement.innerHTML = '';
      weatherInfo.classList.add('hidden');
      cityInput.focus();
    } finally {
      cityInput.disabled = false;
      searchBtn.disabled = false;
      searchBtn.textContent = 'Search';
    }
  }

  function displayWeather(data) {
    // Clear any existing time interval
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
    }
    const { name, main, weather, wind, timezone } = data;
    const weatherCondition = weather[0].main.toLowerCase();
    
    let mappedCondition = 'default';
    if (weatherCondition.includes('clear')) mappedCondition = 'sunny';
    else if (weatherCondition.includes('cloud')) mappedCondition = 'clouds';
    else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) mappedCondition = 'rain';
    else if (weatherCondition.includes('thunder') || weatherCondition.includes('storm')) mappedCondition = 'stormy';
    else if (weatherCondition.includes('snow')) mappedCondition = 'snowy';
    else if (weatherCondition.includes('mist') || weatherCondition.includes('fog') || weatherCondition.includes('haze')) mappedCondition = 'mist';

    cityName.textContent = name;
    temperature.textContent = `${Math.round(main.temp)}°C`;
    weatherDescription.textContent = weather[0].description;
    humidityElement.textContent = `${main.humidity}%`;
    windSpeedElement.textContent = `${Math.round(wind.speed * 3.6)} km/h`;

    weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
    weatherIcon.onerror = () => {
      weatherIcon.src = 'https://openweathermap.org/img/wn/10d@4x.png';
    };

    weatherInfo.classList.remove('hidden');
    const style = weatherStyles[mappedCondition] || weatherStyles.default;
    weatherQuote.textContent = style.quote;

    // Reset animation classes and apply new one
    weatherIconContainer.className = 'p-4 rounded-full bg-white/30 backdrop-blur-md shadow-md w-32 h-32 flex items-center justify-center';
    if (style.animation) {
      weatherIconContainer.classList.add(style.animation);
    }

    startBackgroundSlideshow(mappedCondition);
    updateLocalTime(timezone);
  }

  function displayForecast(data) {
    forecastElement.innerHTML = '';
    const dailyForecasts = [];
    const dates = new Set();

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dates.has(date)) {
        dates.add(date);
        dailyForecasts.push(item);
        if (dailyForecasts.length >= 4) return;
      }
    });

    dailyForecasts.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

      const forecastCard = document.createElement('div');
      forecastCard.className = 'bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20 text-center';
      forecastCard.innerHTML = `
        <p class="font-semibold text-white">${day}</p>
        <img src="${iconUrl}" alt="${item.weather[0].description}" class="w-12 h-12 mx-auto my-1">
        <div class="flex justify-center gap-2">
          <span class="font-bold text-white">${Math.round(item.main.temp_max)}°</span>
          <span class="opacity-70 text-white">${Math.round(item.main.temp_min)}°</span>
        </div>
        <p class="text-xs capitalize text-white/80 mt-1">${item.weather[0].description}</p>
      `;
      forecastElement.appendChild(forecastCard);
    });
  }

  function updateLocalTime(timezoneOffset) {
    // Clear any existing interval first
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
    }

    const update = () => {
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const localTimeObj = new Date(utcTime + (timezoneOffset * 1000));

      localTime.textContent = localTimeObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' • ' + localTimeObj.toLocaleDateString([], {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    };

    update();
    timeUpdateInterval = setInterval(update, 1000);
  }

  searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeatherData(city);
    } else {
      alert('Please enter a city name');
      cityInput.focus();
    }
  });

  cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });

  // Initialize with default background
  startBackgroundSlideshow('default');
});