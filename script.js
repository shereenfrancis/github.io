// Add this near the top of your script.js
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Get this from EmailJS dashboard
})();

const foodTypes = [
    "Italian",
    "Chinese",
    "Mexican",
    "Japanese",
    "Indian",
    "Thai",
    "American",
    "Mediterranean",
    "Vietnamese",
    "Korean",
    "Greek",
    "French",
    "Brazilian",
    "Spanish",
    "Middle Eastern"
];

// Add this variable to store the current food selection
let currentFoodSelection = null;

// Add this after foodTypes array
let isSpinning = false;

// Add this array with activities
const activities = [
    "Try a new coffee shop ☕",
    "Watch a movie at the cinema 🎬",
    "Have a picnic in the park 🧺",
    "Go for a scenic drive 🚗",
    "Visit a local market 🛒",
    "Take a cooking class together 👩‍🍳",
    "Go for a hike 🥾",
    "Visit an art gallery 🎨",
    "Have a game night 🎲",
    "Try a new restaurant 🍴",
    "Go bowling 🎳",
    "Visit a botanical garden 🌺",
    "Take dance lessons 💃",
    "Go for ice cream 🍦",
    "Have a spa day 💆🏻‍♀️",
    "Go mini golfing ⛳",
    "Visit a wine farm 🍷",
    "Go to a concert 🎵",
    "Take a photography walk 📸",
    "Try a new dessert place 🍰",
    "Go stargazing 🌌",
    "Have a sunset picnic 🌅",
    "Visit a local brewery 🍺",
    "Go to an escape room 🔓",
    "Take a pottery class 🎨"
];

// Update the romantic colors
const ROMANTIC_COLORS = {
    primary: '#e63946',    // Vibrant red
    secondary: '#ffcdd2',  // Light red
    accent: '#c1121f',     // Deep red
    background: '#fff5f5', // Very light red
    text: '#2d3436'        // Dark text color
};

// Add this function to apply romantic theme
function applyRomanticTheme() {
    document.documentElement.style.setProperty('--primary-color', ROMANTIC_COLORS.primary);
    document.documentElement.style.setProperty('--secondary-color', ROMANTIC_COLORS.secondary);
    document.documentElement.style.setProperty('--accent-color', ROMANTIC_COLORS.accent);
    document.documentElement.style.setProperty('--background-color', ROMANTIC_COLORS.background);
    document.documentElement.style.setProperty('--text-color', ROMANTIC_COLORS.text);
}

// Update confetti colors
function triggerConfetti() {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        spread: 90,
        ticks: 50,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        colors: ['#e63946', '#ffcdd2', '#c1121f', '#ffeaea', '#fff5f5'] // Red theme colors
    };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

function pickRandomFood() {
    if (isSpinning) return;
    
    const spinner = document.getElementById('slot-spinner');
    const spinButton = document.getElementById('spinButton');
    const mapsButton = document.getElementById('mapsButton');
    const recipeButton = document.getElementById('recipeButton');
    
    isSpinning = true;
    spinButton.disabled = true;
    mapsButton.disabled = true;
    recipeButton.disabled = true;

    // Pick a random food type
    const randomIndex = Math.floor(Math.random() * foodTypes.length);
    currentFoodSelection = foodTypes[randomIndex];

    // Create a spinning animation effect
    spinner.innerHTML = `<div class="slot-item">${currentFoodSelection}</div>`;
    spinner.style.opacity = '0';

    // Animate the selection
    setTimeout(() => {
        spinner.style.transition = 'opacity 0.5s ease';
        spinner.style.opacity = '1';
        
        // Enable buttons and trigger confetti
        isSpinning = false;
        spinButton.disabled = false;
        mapsButton.disabled = false;
        recipeButton.disabled = false;
        triggerConfetti();
    }, 500);
}

function createGoogleMapsUrl(searchQuery, coords) {
    if (coords) {
        // Search for restaurants near the user's location
        return `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@${coords.latitude},${coords.longitude},14z`;
    } else {
        // Fallback to just searching for restaurants
        return `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    }
}

async function searchNearbyFood() {
    if (!currentFoodSelection) return;
    
    try {
        const coords = await getUserLocation();
        const searchQuery = `${currentFoodSelection} restaurants near me`;
        const mapsUrl = createGoogleMapsUrl(searchQuery, coords);
        window.open(mapsUrl, '_blank');
    } catch (error) {
        // Fallback to searching without coordinates
        const searchQuery = `${currentFoodSelection} restaurants`;
        const mapsUrl = createGoogleMapsUrl(searchQuery);
        window.open(mapsUrl, '_blank');
    }
}

// Adding movie functionality
const API_KEY = '4b723d9d2e53c8a7c14dbf5a92159da7'; // Replace with your API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchNowPlayingMovies() {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&region=ZA`
        );
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
        document.getElementById('movies-grid').innerHTML = 
            '<p style="text-align: center; grid-column: 1/-1;">Error loading movies. Please try again later.</p>';
    }
}

// Add this constant for OMDB API
const OMDB_API_KEY = '95c831ff';  // Using the provided API key

// Add this function to fetch IMDB rating
async function getImdbRating(movieTitle, year) {
    try {
        const response = await fetch(
            `https://omdbapi.com/?apikey=${OMDB_API_KEY}&t=${movieTitle}&y=${year}`
        );
        const data = await response.json();
        
        // Check if we got a valid response and IMDB rating
        if (data.Response === "True" && data.imdbRating) {
            return data.imdbRating;
        }
        return 'N/A';
    } catch (error) {
        console.error('Error fetching IMDB rating:', error);
        return 'N/A';
    }
}

// Update the displayMovies function
async function displayMovies(movies) {
    const moviesGrid = document.getElementById('movies-grid');
    
    // Create array of promises for fetching IMDB ratings
    const moviePromises = movies.map(async movie => {
        const year = new Date(movie.release_date).getFullYear();
        const imdbScore = await getImdbRating(movie.title, year);
        
        const genres = movie.genre_ids
            .map(id => genresMap[id])
            .filter(name => name)
            .join(', ');
            
        const nuMetroSearchTitle = movie.title.replace(/\s+/g, '+');
            
        return `
        <div class="movie-card" style="
            background: ${ROMANTIC_COLORS.background};
            border-radius: 15px;
            box-shadow: 0 8px 16px rgba(255, 107, 107, 0.1);
            transition: transform 0.3s ease;
        ">
            <img 
                src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'placeholder-image-url.jpg'}" 
                alt="${movie.title}"
                onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'"
            >
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="metacritic-score ${getScoreClass(imdbScore)}">
                    ${imdbScore}
                </div>
                <p class="movie-genres">${genres}</p>
                <p class="movie-release">Release: ${new Date(movie.release_date).toLocaleDateString()}</p>
            </div>
            <div class="movie-overview">
                <div>
                    <h3>${movie.title}</h3>
                    <p>${movie.overview || 'No description available.'}</p>
                    <p class="movie-genres"><strong>Genres:</strong> ${genres}</p>
                    <p><strong>IMDB:</strong> ${imdbScore}</p>
                </div>
                <div class="movie-actions">
                    <a 
                        href="https://www.sterkinekor.com/search/${movie.title}" 
                        target="_blank" 
                        class="showtime-btn sterkinekor"
                    >
                        Find at Ster Kinekor
                    </a>
                    <a 
                        href="https://numetro.co.za/movies/${nuMetroSearchTitle}" 
                        target="_blank" 
                        class="showtime-btn numetro"
                    >
                        Find at Nu Metro
                    </a>
                </div>
            </div>
        </div>
    `});
    
    // Wait for all ratings to be fetched
    const movieCards = await Promise.all(moviePromises);
    moviesGrid.innerHTML = movieCards.join('');
}

// Add helper function for score colors
function getScoreClass(score) {
    if (score === 'N/A') return 'score-na';
    const numScore = parseFloat(score);
    if (numScore >= 7.5) return 'score-high';
    if (numScore >= 6.0) return 'score-medium';
    return 'score-low';
}

// Add this after the existing constants
const genresMap = {};

// Add this new function to fetch genres
async function fetchGenres() {
    try {
        const response = await fetch(
            `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
        );
        const data = await response.json();
        data.genres.forEach(genre => {
            genresMap[genre.id] = genre.name;
        });
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

// Add this constant for OpenWeatherMap API
const WEATHER_API_KEY = 'dabfc5dd67014e5f8c1143118250601';  // Free API key from https://weatherapi.com

// Add this function to fetch weather
async function fetchWeather() {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=Johannesburg&days=4&aqi=no`
        );
        const data = await response.json();
        
        if (data.current) {
            displayWeather(data);
        } else {
            throw new Error('Weather data not available');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.querySelector('.weather-info').innerHTML = 
            '<p>Error loading weather. Please try again later.</p>';
    }
}

function getWeatherIcon(description) {
    description = description.toLowerCase();
    if (description.includes('rain') || description.includes('drizzle')) {
        return 'rainy';
    } else if (description.includes('cloudy') && description.includes('partly')) {
        return 'partly-cloudy';
    } else if (description.includes('cloud') || description.includes('overcast')) {
        return 'cloudy';
    } else {
        return 'sunny';
    }
}

function displayWeather(data) {
    const weatherInfo = document.querySelector('.weather-info');
    
    // Display current weather
    const currentWeather = weatherInfo.querySelector('.current-weather');
    currentWeather.querySelector('.temp').textContent = 
        `${Math.round(data.current.temp_c)}°C`;
    
    const currentDesc = data.current.condition.text;
    currentWeather.querySelector('.description').textContent = currentDesc;
    
    // Add romantic weather icons
    const weatherIcons = {
        sunny: '☀️',
        rainy: '🌧️',
        cloudy: '☁️',
        'partly-cloudy': '⛅',
        // Add more weather icons as needed
    };
    
    // Update icon display
    currentWeather.querySelector('.weather-icon').innerHTML = 
        weatherIcons[getWeatherIcon(currentDesc)] || '🌈';
    
    currentWeather.querySelector('.wind').textContent = 
        `${Math.round(data.current.wind_kph)} km/h`;
    
    currentWeather.querySelector('.rain').textContent = 
        `Rain: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;

    // Display forecast for next 3 days
    const forecastDays = weatherInfo.querySelectorAll('.forecast-day');
    
    data.forecast.forecastday.slice(1).forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const desc = day.day.condition.text;
        
        forecastDays[index].querySelector('.date').textContent = dayName;
        forecastDays[index].querySelector('.temp').textContent = 
            `${Math.round(day.day.avgtemp_c)}°C`;
        forecastDays[index].querySelector('.description').textContent = desc;
        forecastDays[index].querySelector('.weather-icon').className = 
            `weather-icon ${getWeatherIcon(desc)}`;
        forecastDays[index].querySelector('.wind').textContent = 
            `${Math.round(day.day.maxwind_kph)} km/h`;
        forecastDays[index].querySelector('.rain').textContent = 
            `Rain: ${day.day.daily_chance_of_rain}%`;
    });
}

// Update the initialize function to include weather
async function initialize() {
    await fetchGenres();
    await fetchNowPlayingMovies();
    await fetchWeather();
    addRomanticButtonEffects();
    applyRomanticTheme();
}

// Update the event listener to use the new initialize function
document.addEventListener('DOMContentLoaded', initialize); 

// Add these functions after your existing constants
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        const options = {
            enableHighAccuracy: true,  // Request highest possible accuracy
            timeout: 15000,            // Increased timeout for better accuracy
            maximumAge: 0              // Always get fresh position
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude.toFixed(6),  // Higher precision
                    longitude: position.coords.longitude.toFixed(6),
                    accuracy: position.coords.accuracy,             // Track accuracy in meters
                    altitude: position.coords.altitude,             // Include altitude if available
                };
                resolve(coords);
            },
            (error) => {
                let errorMessage;
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access was denied";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out";
                        break;
                    default:
                        errorMessage = "An unknown error occurred";
                }
                reject(new Error(errorMessage));
            },
            options
        );
    });
}

// Add this function to handle the Maps button click
async function openGoogleMaps(event, searchQuery) {
    event.preventDefault();
    try {
        const coords = await getUserLocation();
        const mapsUrl = createGoogleMapsUrl(searchQuery, coords);
        window.open(mapsUrl, '_blank');
    } catch (error) {
        // Fallback to searching without coordinates
        const mapsUrl = createGoogleMapsUrl(searchQuery);
        window.open(mapsUrl, '_blank');
    }
}

async function searchRecipes() {
    if (!currentFoodSelection) return;
    
    // Create a search query that includes the cuisine type
    const searchQuery = encodeURIComponent(`${currentFoodSelection} recipes`);
    
    // Open a new tab with recipe search results
    const urls = [
        `https://www.allrecipes.com/search?q=${searchQuery}`,
        `https://www.foodnetwork.com/search/${searchQuery}-`,
        `https://tasty.co/search?q=${searchQuery}`,
        `https://www.epicurious.com/search/${searchQuery}`
    ];
    
    // Open the first URL and store others as backup options
    window.open(urls[0], '_blank');
    
    // Create a dropdown with other recipe sites
    const recipeDropdown = document.createElement('div');
    recipeDropdown.className = 'recipe-dropdown';
    recipeDropdown.innerHTML = `
        <h4>More Recipe Sites:</h4>
        <ul>
            ${urls.slice(1).map(url => `
                <li><a href="${url}" target="_blank">Find on ${new URL(url).hostname.split('.')[1]}</a></li>
            `).join('')}
        </ul>
    `;
    
    // Add the dropdown near the recipe button
    const recipeButton = document.getElementById('recipeButton');
    recipeButton.parentNode.appendChild(recipeDropdown);
    
    // Remove the dropdown after 5 seconds
    setTimeout(() => {
        recipeDropdown.remove();
    }, 5000);
}

// Update the recipe picker function
async function pickRandomRecipe() {
    const recipeResult = document.getElementById('recipe-result');
    const recipeCard = document.getElementById('recipe-card');
    
    // Show loading state
    recipeCard.classList.add('loading');
    recipeResult.innerHTML = `
        <div class="spinner">
            <div class="loading-text">Finding a romantic recipe...</div>
        </div>
    `;

    try {
        // List of romantic recipe keywords
        const romanticRecipes = [
            "chocolate covered strawberries",
            "romantic pasta dinner",
            "heart shaped cookies",
            "valentine's day dinner",
            "romantic dessert",
            "date night dinner",
            "candlelight dinner",
            "romantic appetizers",
            "love themed cupcakes",
            "romantic breakfast in bed"
        ];

        // Pick a random romantic recipe theme
        const randomTheme = romanticRecipes[Math.floor(Math.random() * romanticRecipes.length)];
        
        // Create search URL for Allrecipes
        const searchQuery = currentFoodSelection 
            ? `${currentFoodSelection} romantic dinner`
            : randomTheme;
        
        const recipeUrl = `https://www.allrecipes.com/search?q=${encodeURIComponent(searchQuery)}`;

        // Show the result
        setTimeout(() => {
            recipeCard.classList.remove('loading');
            recipeResult.innerHTML = `
                <div class="recipe-suggestion">
                    <h3>How about making:</h3>
                    <p class="recipe-title">${searchQuery}</p>
                <a href="${recipeUrl}" 
                   target="_blank" 
                   class="recipe-link">
                        Find Recipes
                </a>
                </div>
            `;
        }, 1500);
        
    } catch (error) {
        console.error('Error suggesting recipe:', error);
        recipeCard.classList.remove('loading');
        recipeResult.innerHTML = `
            <div class="error-message">
                <p>Oops! Couldn't find a recipe right now.</p>
                <p>Please try again.</p>
                </div>
        `;
    }
} 

// Update the initialization code
document.addEventListener('DOMContentLoaded', () => {
    // Create particle background
    createParticleBackground();
    createFloatingHearts();
    
    // Apply romantic theme and background
    applyRomanticTheme();
    const body = document.body;
    body.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg width="52" height="26" viewBox="0 0 52 26" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ff6b6b" fill-opacity="0.1"%3E%3Cpath d="M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
    body.style.backgroundColor = ROMANTIC_COLORS.background;
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add welcome animations
    const welcomeSection = document.querySelector('.welcome-section');
    welcomeSection.classList.add('animate');
    
    // Add subtle floating animation to tagline
    const tagline = document.querySelector('.tagline');
    setInterval(() => {
        tagline.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 5}px)`;
    }, 50);
    
    // Add sparkle effect
    createSparkles();
    
    // Initialize slot machine
    const spinner = document.getElementById('slot-spinner');
    const slotsContent = foodTypes.map(food => 
        `<div class="slot-item">${food}</div>`
    ).join('');
    spinner.innerHTML = slotsContent;
    
    // Initialize other features
    initialize();

    // Add parallax effect to cards
    document.querySelectorAll('.mood-card, .suggestion-card, .activity-card, .memory-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.05, 1.05, 1.05)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
        });
    });

    // Add magnetic effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });

    // Add smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 

function toggleMoviesSection() {
    const moviesGrid = document.getElementById('movies-grid');
    moviesGrid.classList.toggle('collapsed');
    
    // If we're expanding and haven't loaded movies yet, load them
    if (!moviesGrid.classList.contains('collapsed') && !document.querySelector('.movie-card')) {
        fetchNowPlayingMovies();
    }
} 

async function updateLocationWeather() {
    try {
        const weatherTitle = document.querySelector('.weather-section h2');
        weatherTitle.textContent = 'Getting your precise location...';

        const coords = await getUserLocation();
        
        // Log accuracy information
        console.log(`Location accuracy: ${coords.accuracy} meters`);
        
        weatherTitle.textContent = 'Fetching detailed weather data...';

        // First get detailed location information using reverse geocoding
        const geocodeResponse = await fetch(
            `https://api.weatherapi.com/v1/reverse.json?key=${WEATHER_API_KEY}&q=${coords.latitude},${coords.longitude}`
        );

        if (!geocodeResponse.ok) {
            throw new Error('Failed to get detailed location information');
        }

        const locationData = await geocodeResponse.json();
        
        if (!locationData || locationData.length === 0) {
            throw new Error('No location data found');
        }

        // Get the most precise location name
        const location = locationData[0];
        const locationName = [
            location.name,
            location.region,
            location.country
        ].filter(Boolean).join(', ');

        // Now get weather data
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location.name}&days=4&aqi=no`
        );

        if (!response.ok) {
            throw new Error(`Weather API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'Error from weather service');
        }
        
        if (data.current) {
            // Update the weather heading with location name
            weatherTitle.textContent = `Weather in ${locationName}`;
            
            // Display the weather data - this updates ALL weather info
            displayWeather(data);
        } else {
            throw new Error('Weather data format was unexpected');
        }
    } catch (error) {
        console.error('Detailed error:', error);
        
        let errorMessage = 'Unable to get weather for your location. ';
        if (error.name === 'GeolocationPositionError') {
            errorMessage += 'Please allow location access and try again.';
        } else {
            errorMessage += 'Please try again later.';
        }
        
        alert(errorMessage);
        weatherTitle.textContent = 'Weather';
    }
} 

const activityDetails = {
    "Have a game night 🎲": {
        title: "Game Night Ideas",
        suggestions: [
            {
                category: "Board Games",
                items: [
                    "Monopoly",
                    "Scrabble",
                    "Chess",
                    "Jenga",
                    "Pictionary"
                ]
            },
            {
                category: "Card Games",
                items: [
                    "Uno",
                    "Phase 10",
                    "Poker",
                    "Rummy",
                    "Cards Against Humanity"
                ]
            },
            {
                category: "What to Prepare",
                items: [
                    "Snacks & Finger Foods",
                    "Drinks",
                    "Comfortable Seating",
                    "Good Lighting",
                    "Background Music"
                ]
            }
        ]
    },
    "Watch a movie at the cinema 🎬": {
        title: "Movie Date Tips",
        suggestions: [
            {
                category: "Before the Movie",
                items: [
                    "Check movie reviews",
                    "Book tickets in advance",
                    "Choose good seats",
                    "Arrive early",
                    "Get snacks ready"
                ]
            },
            {
                category: "Movie Snacks",
                items: [
                    "Popcorn",
                    "Chocolate",
                    "Soft Drinks",
                    "Nachos",
                    "Candy"
                ]
            }
        ]
    },
    "Have a picnic in the park 🧺": {
        title: "Perfect Picnic Guide",
        suggestions: [
            {
                category: "What to Pack",
                items: [
                    "Picnic Blanket",
                    "Plates & Utensils",
                    "Napkins",
                    "Cooler Bag",
                    "Portable Speaker"
                ]
            },
            {
                category: "Food Ideas",
                items: [
                    "Sandwiches",
                    "Fresh Fruits",
                    "Cheese & Crackers",
                    "Cold Drinks",
                    "Desserts"
                ]
            }
        ]
    },
    "Go for a scenic drive 🚗": {
        title: "Scenic Drive Tips",
        suggestions: [
            {
                category: "Preparation",
                items: [
                    "Check car condition",
                    "Plan your route",
                    "Download offline maps",
                    "Fill up gas tank",
                    "Check weather forecast"
                ]
            },
            {
                category: "What to Bring",
                items: [
                    "Road trip playlist",
                    "Snacks & Drinks",
                    "Camera",
                    "Blanket",
                    "Emergency kit"
                ]
            }
        ]
    },
    "Try a new coffee shop ☕": {
        title: "Coffee Date Tips",
        suggestions: [
            {
                category: "What to Try",
                items: [
                    "Specialty Lattes",
                    "Fresh Pastries",
                    "Local Roasts",
                    "Coffee Tasting Flight",
                    "Barista Recommendations"
                ]
            },
            {
                category: "Conversation Starters",
                items: [
                    "Coffee Preferences",
                    "Favorite Cafes",
                    "Travel Stories",
                    "Future Dreams",
                    "Childhood Memories"
                ]
            }
        ]
    },
    "Go stargazing 🌌": {
        title: "Stargazing Guide",
        suggestions: [
            {
                category: "Best Locations",
                items: [
                    "Open fields away from city",
                    "High viewpoints",
                    "Beach at night",
                    "Rooftop spots",
                    "Local observatories"
                ]
            },
            {
                category: "What to Bring",
                items: [
                    "Blankets",
                    "Hot drinks",
                    "Star map app",
                    "Snacks",
                    "Comfortable chairs"
                ]
            }
        ]
    },
    "Take a pottery class 🎨": {
        title: "Pottery Class Date",
        suggestions: [
            {
                category: "What to Expect",
                items: [
                    "Learn basic hand-building techniques",
                    "Try the pottery wheel",
                    "Create matching mugs or bowls",
                    "Paint and glaze your creations",
                    "Return later to collect your fired pieces"
                ]
            },
            {
                category: "What to Wear",
                items: [
                    "Comfortable clothes you don't mind getting dirty",
                    "Closed-toe shoes",
                    "Apron (usually provided)",
                    "Hair tie for long hair",
                    "Short nails recommended"
                ]
            },
            {
                category: "Make It Special",
                items: [
                    "Take photos of the process",
                    "Make something for each other",
                    "Sign and date your creations",
                    "Plan a reveal date for finished pieces",
                    "Display your art pieces at home"
                ]
            }
        ]
    },
    "Go bowling 🎳": {
        title: "Bowling Date Guide",
        suggestions: [
            {
                category: "Game Ideas",
                items: [
                    "Winner buys dinner",
                    "Silly bowling styles round",
                    "Team up against other couples",
                    "Keep track of high scores",
                    "Play with themed rules"
                ]
            },
            {
                category: "What to Order",
                items: [
                    "Classic bowling alley fries",
                    "Shared pizza",
                    "Milkshakes",
                    "Nachos",
                    "Bowling alley snacks"
                ]
            }
        ]
    },
    "Visit a botanical garden 🌺": {
        title: "Botanical Garden Date",
        suggestions: [
            {
                category: "Activities",
                items: [
                    "Photo scavenger hunt",
                    "Sketch your favorite flowers",
                    "Learn plant names together",
                    "Find the most unique plant",
                    "Pack a garden picnic"
                ]
            },
            {
                category: "Best Times to Visit",
                items: [
                    "Early morning for best light",
                    "During flower blooming seasons",
                    "Special garden events",
                    "Sunset for romantic atmosphere",
                    "After light rain for fresh scenery"
                ]
            }
        ]
    },
    "Take dance lessons 💃": {
        title: "Dance Class Date",
        suggestions: [
            {
                category: "Dance Styles to Try",
                items: [
                    "Salsa - energetic and fun",
                    "Ballroom - elegant and classic",
                    "Swing - playful and upbeat",
                    "Bachata - romantic and sensual",
                    "Contemporary - expressive and free"
                ]
            },
            {
                category: "Tips for Beginners",
                items: [
                    "Arrive 10 minutes early",
                    "Wear comfortable shoes",
                    "Don't be afraid to laugh",
                    "Take water breaks",
                    "Practice at home together"
                ]
            }
        ]
    },
    "Try a new restaurant 🍴": {
        title: "Restaurant Date Guide",
        suggestions: [
            {
                category: "How to Choose",
                items: [
                    "Check online reviews and ratings",
                    "Look at food photos on Instagram",
                    "Ask friends for recommendations",
                    "Try a cuisine you've never had",
                    "Look for places with romantic ambiance"
                ]
            },
            {
                category: "Make it Special",
                items: [
                    "Make a reservation in advance",
                    "Dress up for the occasion",
                    "Try each other's dishes",
                    "Order something to share",
                    "Take photos of your experience"
                ]
            },
            {
                category: "Conversation Starters",
                items: [
                    "Share favorite food memories",
                    "Plan future food adventures",
                    "Rate each dish together",
                    "Guess the ingredients",
                    "Share childhood food stories"
                ]
            }
        ]
    },
    "Visit a local market 🛒": {
        title: "Market Date Adventure",
        suggestions: [
            {
                category: "Fun Activities",
                items: [
                    "Sample local foods together",
                    "Pick ingredients for dinner",
                    "Find the most unique item",
                    "Meet local vendors",
                    "Try street food specialties"
                ]
            },
            {
                category: "What to Look For",
                items: [
                    "Fresh local produce",
                    "Artisanal products",
                    "Handmade crafts",
                    "Food demonstrations",
                    "Seasonal specialties"
                ]
            }
        ]
    },
    "Take a cooking class together 👩‍🍳": {
        title: "Cooking Class Date",
        suggestions: [
            {
                category: "Class Types to Consider",
                items: [
                    "Pasta making from scratch",
                    "Sushi rolling basics",
                    "Dessert and pastry making",
                    "International cuisines",
                    "Couple's specific classes"
                ]
            },
            {
                category: "Tips for Success",
                items: [
                    "Read class reviews first",
                    "Wear comfortable shoes",
                    "Take photos of the process",
                    "Ask lots of questions",
                    "Save the recipe to make at home"
                ]
            }
        ]
    },
    "Go for ice cream 🍦": {
        title: "Ice Cream Date Ideas",
        suggestions: [
            {
                category: "Make it Fun",
                items: [
                    "Try each other's flavors",
                    "Rate different ice cream shops",
                    "Create your own sundaes",
                    "Try unusual flavors",
                    "Take funny ice cream photos"
                ]
            },
            {
                category: "Best Times to Go",
                items: [
                    "After dinner treat",
                    "Hot summer afternoon",
                    "Post-movie dessert",
                    "Weekend adventure",
                    "Special flavor release days"
                ]
            }
        ]
    },
    "Go mini golfing ⛳": {
        title: "Mini Golf Date Guide",
        suggestions: [
            {
                category: "Fun Challenges",
                items: [
                    "Winner picks dinner spot",
                    "Take silly putting poses",
                    "Create trick shots",
                    "Keep a couples scorecard",
                    "Make friendly wagers"
                ]
            },
            {
                category: "Make it Memorable",
                items: [
                    "Take victory photos",
                    "Create team names",
                    "Celebrate good shots",
                    "Play at sunset",
                    "Get ice cream after"
                ]
            }
        ]
    },
    "Visit a wine farm 🍷": {
        title: "Wine Tasting Date",
        suggestions: [
            {
                category: "Tasting Tips",
                items: [
                    "Take notes of favorites",
                    "Ask about wine making process",
                    "Learn proper tasting technique",
                    "Share your taste impressions",
                    "Buy a bottle to save for special occasion"
                ]
            },
            {
                category: "What to Do",
                items: [
                    "Take a vineyard tour",
                    "Join a tasting session",
                    "Pack a picnic",
                    "Watch the sunset",
                    "Take photos among the vines"
                ]
            }
        ]
    },
    "Go to a concert 🎵": {
        title: "Concert Date Guide",
        suggestions: [
            {
                category: "Before the Show",
                items: [
                    "Research the artist's popular songs",
                    "Book tickets in advance",
                    "Plan parking or transport",
                    "Check venue rules",
                    "Arrive early for good spots"
                ]
            },
            {
                category: "Make it Special",
                items: [
                    "Create a playlist of the artist",
                    "Get matching concert tees",
                    "Take photos together",
                    "Buy merchandise to remember",
                    "Record favorite moments"
                ]
            }
        ]
    },
    "Take a photography walk 📸": {
        title: "Photography Date Ideas",
        suggestions: [
            {
                category: "Photo Challenges",
                items: [
                    "Find heart shapes in nature",
                    "Take silhouette photos",
                    "Capture candid moments",
                    "Find interesting textures",
                    "Create optical illusions"
                ]
            },
            {
                category: "Best Locations",
                items: [
                    "Historic districts",
                    "Nature trails",
                    "Urban street art",
                    "Botanical gardens",
                    "Sunset viewpoints"
                ]
            }
        ]
    },
    "Try a new dessert place 🍰": {
        title: "Dessert Date Guide",
        suggestions: [
            {
                category: "What to Try",
                items: [
                    "Share different desserts",
                    "Ask for recommendations",
                    "Try seasonal specials",
                    "Order a dessert flight",
                    "Get something to take home"
                ]
            },
            {
                category: "Make it Fun",
                items: [
                    "Rate each dessert together",
                    "Take photos before eating",
                    "Guess the ingredients",
                    "Try making it at home later",
                    "Create a dessert bucket list"
                ]
            }
        ]
    },
    "Have a spa day 💆🏻‍♀️": {
        title: "Spa Day Date Guide",
        suggestions: [
            {
                category: "Treatment Ideas",
                items: [
                    "Couples massage",
                    "Hot stone therapy",
                    "Facial treatments",
                    "Aromatherapy session",
                    "Hydrotherapy"
                ]
            },
            {
                category: "Spa Etiquette",
                items: [
                    "Arrive 15 minutes early",
                    "Turn off phones",
                    "Use indoor voices",
                    "Stay hydrated",
                    "Take time to relax after"
                ]
            },
            {
                category: "Extra Tips",
                items: [
                    "Book in advance",
                    "Check package deals",
                    "Discuss preferences",
                    "Use all facilities",
                    "Plan a relaxing evening after"
                ]
            }
        ]
    },
    "Visit a local brewery 🍺": {
        title: "Brewery Date Guide",
        suggestions: [
            {
                category: "What to Try",
                items: [
                    "Get a tasting flight",
                    "Try seasonal brews",
                    "Take a brewery tour",
                    "Learn about brewing process",
                    "Pair with brewery snacks"
                ]
            },
            {
                category: "Make it Fun",
                items: [
                    "Rate each beer together",
                    "Take tasting notes",
                    "Ask about ingredients",
                    "Buy a growler to take home",
                    "Get brewery merchandise"
                ]
            }
        ]
    },
    "Go for a hike 🥾": {
        title: "Hiking Date Guide",
        suggestions: [
            {
                category: "Preparation",
                items: [
                    "Check weather forecast",
                    "Pack plenty of water",
                    "Bring trail snacks",
                    "Wear proper shoes",
                    "Download trail map"
                ]
            },
            {
                category: "What to Pack",
                items: [
                    "First aid kit",
                    "Sun protection",
                    "Camera",
                    "Extra layers",
                    "Emergency charger"
                ]
            },
            {
                category: "Make it Special",
                items: [
                    "Pack a trail picnic",
                    "Take summit selfies",
                    "Collect small mementos",
                    "Play nature bingo",
                    "Watch sunset if timing works"
                ]
            }
        ]
    }
};

function suggestActivity() {
    const result = document.getElementById('activity-result');
    if (!result) {
        console.error('Activity result element not found');
        return;
    }
    
    // Pick random activity
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    // Add animation class
    result.classList.remove('show');
    
    // Update content with animation
    setTimeout(() => {
        result.innerHTML = `
            <div class="activity-suggestion">
                <h3>${randomActivity}</h3>
                <button onclick="showActivityDetails('${randomActivity}')" class="details-btn">
                    Show Details
                </button>
            </div>
        `;
        result.classList.add('show');
        triggerConfetti();
    }, 100);
}

function showActivityDetails(activity) {
    const details = activityDetails[activity];
    const result = document.getElementById('activity-result');
    
    if (!details) {
        // Show a generic response for activities without specific details
        result.innerHTML = `
            <div class="activity-details">
                <h3>${activity}</h3>
                <p class="no-details-message">Ready for your adventure? Click the button below to try another activity!</p>
                <button onclick="suggestActivity()" class="generate-btn">
                    Try Another Activity
                </button>
            </div>
        `;
        return;
    }

    const detailsHtml = `
        <div class="activity-details">
            <h3>${details.title}</h3>
            ${details.suggestions.map(category => `
                <div class="suggestion-category">
                    <h4>${category.category}</h4>
                    <ul class="suggestion-list">
                        ${category.items.map(item => `
                            <li>${item}</li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
            <button onclick="suggestActivity()" class="generate-btn">
                Try Another Activity
            </button>
        </div>
    `;

    result.innerHTML = detailsHtml;
}

// Add romantic hover effects to buttons
function addRomanticButtonEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.transition = 'all 0.3s ease';
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 8px rgba(255, 107, 107, 0.2)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
    });
} 

const moodOptions = {
    "romantic": {
        title: "Romantic Evening",
        color: "#ff6b8b",
        playlist: "37i9dQZF1DX50QitC6Oqtn",
        suggestions: [
            {
                title: "Dining",
                options: [
                    { text: "Candlelit Dinner", icon: "🕯️", action: "showDiningOptions" },
                    { text: "Rooftop Restaurant", icon: "🌃", action: "searchNearbyFood" },
                    { text: "Cook Together", icon: "👩‍🍳", action: "showRecipes" }
                ]
            },
            {
                title: "Activities",
                options: [
                    { text: "Sunset Picnic", icon: "🌅", action: "showPicnicPlanner" },
                    { text: "Dance Class", icon: "💃", action: "findDanceClasses" },
                    { text: "Wine Tasting", icon: "🍷", action: "findWineries" }
                ]
            },
            {
                title: "Entertainment",
                options: [
                    { text: "Romantic Movies", icon: "🎬", action: "showRomanticMovies" },
                    { text: "Live Music", icon: "🎵", action: "findLiveMusic" },
                    { text: "Stargazing", icon: "✨", action: "showStargazingSpots" }
                ]
            }
        ]
    },
    "adventurous": {
        title: "Adventure Date",
        color: "#4CAF50",
        playlist: "37i9dQZF1DX1rVvRgjX59F",
        suggestions: [
            {
                title: "Activities",
                options: [
                    { text: "Hiking Trails", icon: "🥾", action: "findHikingTrails" },
                    { text: "Rock Climbing", icon: "🧗‍♀️", action: "findClimbingGyms" },
                    { text: "Water Sports", icon: "🏄‍♂️", action: "findWaterActivities" }
                ]
            },
            {
                title: "Experiences",
                options: [
                    { text: "Escape Room", icon: "🔐", action: "findEscapeRooms" },
                    { text: "Adventure Park", icon: "🎢", action: "findAdventureParks" },
                    { text: "Photography Tour", icon: "📸", action: "findPhotoSpots" }
                ]
            }
        ]
    },
    "cozy": {
        title: "Cozy Night In",
        color: "#8B4513",
        playlist: "37i9dQZF1DWWQRwui0ExPn",
        suggestions: [
            {
                title: "Activities",
                options: [
                    { text: "Movie Marathon", icon: "🎬", action: "showMovieMarathonPlanner" },
                    { text: "Board Games", icon: "🎲", action: "showBoardGames" },
                    { text: "Baking Together", icon: "🧁", action: "showBakingRecipes" }
                ]
            },
            {
                title: "Setting",
                options: [
                    { text: "Build a Fort", icon: "🏰", action: "showFortInstructions" },
                    { text: "Spa Night", icon: "💆‍♀️", action: "showSpaIdeas" },
                    { text: "Indoor Picnic", icon: "🧺", action: "showIndoorPicnicIdeas" }
                ]
            }
        ]
    }
};

const conversationStarters = [
    "What's your favorite memory of us?",
    "Where would you love to travel together?",
    "What's your dream date?",
    "What made you smile today?",
    "What's your idea of a perfect weekend?",
    // Add more romantic conversation starters
];

function getRandomConversation() {
    const randomIndex = Math.floor(Math.random() * conversationStarters.length);
    return conversationStarters[randomIndex];
} 

function calculateDateCost() {
    const dining = parseFloat(document.getElementById('dining-cost').value) || 0;
    const activity = parseFloat(document.getElementById('activity-cost').value) || 0;
    const transport = parseFloat(document.getElementById('transport-cost').value) || 0;
    const extras = parseFloat(document.getElementById('extras-cost').value) || 0;
    
    const total = dining + activity + transport + extras;
    document.getElementById('total-cost').textContent = `R${total.toFixed(2)}`;
} 

function saveDate(dateDetails) {
    const savedDates = JSON.parse(localStorage.getItem('savedDates') || '[]');
    savedDates.push({
        ...dateDetails,
        savedAt: new Date().toISOString()
    });
    localStorage.setItem('savedDates', JSON.stringify(savedDates));
} 

function changePlaylist(playlistId) {
    const player = document.getElementById('spotify-player');
    if (player) {
        player.src = `https://open.spotify.com/embed/playlist/${playlistId}`;
    }
}

function showTab(tabName) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content and activate button
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    
    // If memories tab is selected, show memories content
    if (tabName === 'memories') {
        const memories = dateMemories.getAllMemories();
        if (memories.length === 0) {
            document.getElementById('memories-content').innerHTML = `
                <div class="no-memories">
                    <p>No memories saved yet. Create your first date memory! 💝</p>
                    <button onclick="showMemoryForm()" class="create-memory-btn">
                        Create Memory
                    </button>
                </div>
            `;
        } else {
            viewMemories();
        }
    }
    
    // If switching to date planner tab, set up the listeners
    if (tabName === 'date-planner') {
        setupDatePlanner();
    }
}

// Update the viewMemories function
function viewMemories() {
    const memories = dateMemories.getAllMemories();
    const memoriesContent = document.getElementById('memories-content');
    
    memoriesContent.innerHTML = `
        <div class="memories-gallery">
            <div class="memories-grid">
                ${memories.map(memory => `
                    <div class="memory-card">
                        ${memory.photoUrl ? 
                            `<img src="${memory.photoUrl}" alt="${memory.title}">` : 
                            '<div class="no-photo">📷</div>'
                        }
                        <div class="memory-info">
                            <h4>${memory.title}</h4>
                            <p class="memory-date">${new Date(memory.date).toLocaleDateString()}</p>
                            <p class="memory-description">${memory.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Update showMemoryForm to target the correct container
function showMemoryForm() {
    const memoriesContent = document.getElementById('memories-content');
    memoriesContent.innerHTML = `
        <div class="memory-creator">
            <h3>Create a Date Memory</h3>
            <form id="memory-form" class="memory-form" onsubmit="saveMemory(event)">
                <div class="form-group">
                    <label for="date">Date:</label>
                    <input type="date" id="date" required>
                </div>
                <div class="form-group">
                    <label for="title">Title:</label>
                    <input type="text" id="title" placeholder="Our Special Evening" required>
                </div>
                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description" 
                        placeholder="Write about your plans or memories..." 
                        rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label for="photo">Upload Photo:</label>
                    <input type="file" id="photo" accept="image/*" 
                        onchange="previewPhoto(event)">
                    <div id="photo-preview" class="photo-preview"></div>
                </div>
                <button type="submit" class="save-memory-btn">Save Memory</button>
            </form>
        </div>
    `;
}

function previewPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('photo-preview');
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" onclick="clearPhotoPreview()" class="clear-photo-btn">
                    Clear Photo
                </button>
            `;
        };
        reader.readAsDataURL(file);
    }
}

function clearPhotoPreview() {
    const preview = document.getElementById('photo-preview');
    preview.innerHTML = '';
    document.getElementById('photo').value = '';
}

async function saveMemory(event) {
    event.preventDefault();
    
    const date = document.getElementById('date').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const photoFile = document.getElementById('photo').files[0];
    
    let photoUrl = '';
    if (photoFile) {
        photoUrl = await convertToBase64(photoFile);
    }
    
    dateMemories.saveMemory(date, title, description, photoUrl);
    
    // Show success message
    const form = document.getElementById('memory-form');
    form.innerHTML = `
        <div class="success-message">
            <h4>Memory Saved! 💝</h4>
            <p>Your special date has been saved to memories.</p>
            <button onclick="showMemoryForm()" class="new-memory-btn">
                Create Another Memory
            </button>
            <button onclick="viewMemories()" class="view-memories-btn">
                View All Memories
            </button>
        </div>
    `;
    
    triggerConfetti();
}

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function viewMemories() {
    const memories = dateMemories.getAllMemories();
    const memoriesContent = document.getElementById('memories-content');
    
    memoriesContent.innerHTML = `
        <div class="memories-gallery">
            <div class="memories-grid">
                ${memories.map(memory => `
                    <div class="memory-card">
                        ${memory.photoUrl ? 
                            `<img src="${memory.photoUrl}" alt="${memory.title}">` : 
                            '<div class="no-photo">📷</div>'
                        }
                        <div class="memory-info">
                            <h4>${memory.title}</h4>
                            <p class="memory-date">${new Date(memory.date).toLocaleDateString()}</p>
                            <p class="memory-description">${memory.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
} 

// Add this to your existing JavaScript
function addMicroInteractions() {
    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add floating hearts
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '💝';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 20}s`;
        container.appendChild(heart);
    }
}

// Update particle colors
function createParticleBackground() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#e63946" },
            shape: { type: "circle" },
            opacity: {
                value: 0.5,
                random: true,
                animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
            },
            size: {
                value: 3,
                random: true,
                animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#e63946",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                outMode: "bounce",
                attract: { enable: true, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detectsOn: "canvas",
            events: {
                onHover: { enable: true, mode: "repulse" },
                onClick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

function createSparkles() {
    const welcomeSection = document.querySelector('.welcome-section');
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        welcomeSection.appendChild(sparkle);
    }
}

// Add these styles for sparkles
const sparkleStyles = `
.sparkle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: var(--primary);
    border-radius: 50%;
    opacity: 0;
    animation: sparkle 2s linear infinite;
}

@keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 0.5; transform: scale(1); }
}
`;

// Add sparkle styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = sparkleStyles;
document.head.appendChild(styleSheet); 

// Add this function to create heart explosion effect
function createHeartExplosion(x, y) {
    const hearts = 20; // Number of hearts
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // Create hearts in a circle
    for (let i = 0; i < hearts; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = ['💖', '💝', '💗', '💓', '💕'][Math.floor(Math.random() * 5)];
        heart.className = 'exploding-heart';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        
        // Calculate circular position
        const angle = (i / hearts) * Math.PI * 2;
        const velocity = 2 + Math.random() * 2;
        const delay = Math.random() * 100;

        heart.style.setProperty('--angle', angle + 'rad');
        heart.style.setProperty('--velocity', velocity);
        heart.style.setProperty('--delay', delay + 'ms');
        heart.style.setProperty('--random-float', Math.random());

        container.appendChild(heart);
    }

    // Remove container after animation
    setTimeout(() => container.remove(), 2000);
}

// Add click event listener to all buttons
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            createHeartExplosion(e.clientX, e.clientY);
        }
    });
});

// Add this function to handle mood selection
function selectMood(mood) {
    const moodContent = document.getElementById('mood-content');
    if (!moodContent) {
        console.error('Mood content element not found');
        return;
    }

    let content = '';
    
    switch(mood) {
        case 'romantic':
            content = `
                <div class="mood-suggestions">
                    <h3>Romantic Evening Suggestions</h3>
                    <div class="suggestion-grid">
                        <div class="suggestion-card">
                            <h4>Ambiance</h4>
                            <ul>
                                <li>Dim the lights</li>
                                <li>Light scented candles</li>
                                <li>Scatter rose petals</li>
                                <li>Play soft background music</li>
                            </ul>
                        </div>
                        <div class="suggestion-card">
                            <h4>Activities</h4>
                            <ul>
                                <li>Cook dinner together</li>
                                <li>Share a bottle of wine</li>
                                <li>Slow dance in the living room</li>
                                <li>Give each other massages</li>
                            </ul>
                        </div>
                        <div class="suggestion-card">
                            <h4>Conversation</h4>
                            <ul>
                                <li>Share favorite memories</li>
                                <li>Plan future dreams</li>
                                <li>Express appreciation</li>
                                <li>Play romantic trivia</li>
                            </ul>
                        </div>
                    </div>
                </div>`;
            break;
        case 'adventurous':
            content = `
                <div class="mood-suggestions">
                    <h3>Adventure Date Suggestions</h3>
                    <div class="suggestion-grid">
                        <div class="suggestion-card">
                            <h4>Outdoor Activities</h4>
                            <ul>
                                <li>Go hiking together</li>
                                <li>Try rock climbing</li>
                                <li>Have a picnic somewhere new</li>
                                <li>Watch the sunset from a new spot</li>
                            </ul>
                        </div>
                        <div class="suggestion-card">
                            <h4>New Experiences</h4>
                            <ul>
                                <li>Take a cooking class</li>
                                <li>Try an escape room</li>
                                <li>Go to a new restaurant</li>
                                <li>Learn a dance together</li>
                            </ul>
                        </div>
                        <div class="suggestion-card">
                            <h4>Spontaneous Ideas</h4>
                            <ul>
                                <li>Take a random bus/train</li>
                                <li>Explore a new neighborhood</li>
                                <li>Try a new cuisine</li>
                                <li>Visit a local festival</li>
                            </ul>
                        </div>
                    </div>
                </div>`;
            break;
        case 'cozy':
            content = `
                <div class="mood-suggestions">
                    <h3>Cozy Night In Suggestions</h3>
                    <div class="suggestion-grid">
                        <div class="suggestion-card">
                            <h4>Comfort Setup</h4>
                            <ul>
                                <li>Build a blanket fort</li>
                                <li>Put on comfy pajamas</li>
                                <li>Make hot chocolate</li>
                                <li>Light some candles</li>
                            </ul>
                        </div>
                        <div class="suggestion-card">
                            <h4>Activities</h4>
                            <ul>
                                <li>Watch a movie marathon</li>
                                <li>Play board games</li>
                                <li>Cook comfort food</li>
                                <li>Share childhood stories</li>
                            </ul>
                        </div>
                        <div class="suggestion-card">
                            <h4>Snacks & Treats</h4>
                            <ul>
                                <li>Bake cookies together</li>
                                <li>Make popcorn</li>
                                <li>Create a snack platter</li>
                                <li>Mix fun beverages</li>
                            </ul>
                        </div>
                    </div>
                </div>`;
            break;
    }
    
    // Update the content with animation
    moodContent.style.opacity = '0';
    setTimeout(() => {
        moodContent.innerHTML = content;
        moodContent.style.opacity = '1';
        
        // Add animation class to suggestion cards
        const cards = moodContent.querySelectorAll('.suggestion-card');
        cards.forEach((card, index) => {
            card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
        });
    }, 300);
    
    // Highlight selected mood card
    document.querySelectorAll('.mood-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Trigger heart explosion from the selected card
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createHeartExplosion(x, y);
} 

// Update the game arrays with more options
const truthOrDareQuestions = {
    truth: [
        // Romantic Memories (existing ones plus...)
        "What was your first thought when you saw me?",
        "What's the most romantic gesture I've made?",
        "What's your favorite date we've been on?",
        "When did you first realize you wanted to be with me?",
        "What's the sweetest thing I've ever said to you?",
        "What moment made you fall deeper in love?",
        "What's your favorite thing about our love story?",
        "What's the most magical moment we've shared?",
        "What's your favorite way I show you love?",
        "What's the most memorable surprise I've given you?",
        "What's your favorite picture of us and why?",
        "What's the best gift I've ever given you?",
        "What's your favorite memory of us cooking together?",
        "What's the most adventurous thing we've done?",
        "What's your favorite holiday memory with me?",
        
        // Daily Life & Little Things
        "What's your favorite morning routine with me?",
        "What's your favorite way we spend lazy Sundays?",
        "What habit of mine do you find endearing?",
        "What's your favorite thing about living together?",
        "What's the best part of your day with me?",
        "What's your favorite way we show affection?",
        "What's your favorite thing about our bedtime routine?",
        "What's your favorite way we comfort each other?",
        "What's your favorite thing about traveling together?",
        "What's your favorite way we celebrate small wins?",
        "What's your favorite thing about our movie nights?",
        "What's your favorite way we handle disagreements?",
        "What's your favorite thing about our communication style?",
        "What's your favorite way we support each other?",
        "What's your favorite thing about our shared interests?",

        // Future Dreams & Aspirations
        "What's your dream vacation with me?",
        "What's one skill you'd love us to learn together?",
        "What's your vision for our perfect home?",
        "What tradition would you like to start with me?",
        "What's your dream date that we haven't done yet?",
        "What's your biggest hope for our future?",
        "What's one adventure you'd love us to have?",
        "What's your dream way to celebrate our anniversary?",
        "What's your ideal way to grow old together?",
        "What's your dream project to work on together?",
        "What's your vision for our family?",
        "What's your dream way to spend retirement together?",
        "What's your ideal lifestyle with me in 5 years?",
        "What's your dream way to celebrate milestones?",
        "What's your vision for our perfect weekend home?",

        // Feelings & Deep Connection
        "When do you feel most connected to me?",
        "What makes you feel most appreciated?",
        "What's your favorite way I express love?",
        "What moment made you trust me completely?",
        "What makes you feel most secure in our relationship?",
        "What's your favorite way we've grown together?",
        "What's your favorite quality we share?",
        "What's your favorite way we complement each other?",
        "What's your favorite way we handle challenges?",
        "What's your favorite thing about our emotional bond?",
        "What's your favorite way we show understanding?",
        "What's your favorite way we've helped each other grow?",
        "What's your favorite way we show commitment?",
        "What's your favorite way we maintain our connection?",
        "What's your favorite way we show trust?",

        // Fun & Playful
        "What's the funniest thing we've done together?",
        "What's your favorite silly nickname for me?",
        "What's the most ridiculous thing we've laughed about?",
        "What's your favorite inside joke?",
        "What's the most embarrassing thing I've done that made you smile?",
        "What's your favorite way we make each other laugh?",
        "What's the most amusing misunderstanding we've had?",
        "What's your favorite goofy moment together?",
        "What's the most random adventure we've had?",
        "What's your favorite way we act silly together?",
        "What's the most unexpected fun we've had?",
        "What's your favorite spontaneous moment?",
        "What's the most entertaining thing we've created together?",
        "What's your favorite way we cheer each other up?",
        "What's the most amusing habit we've picked up from each other?"
    ],
    dare: [
        // Romantic Performance
        "Sing a love song to me",
        "Create a romantic dance routine",
        "Act out our love story in 60 seconds",
        "Give a speech about why you love me",
        "Write and perform a short romantic poem",
        "Do your best romantic movie monologue",
        "Create a love song using random objects as instruments",
        "Perform a romantic scene from your favorite movie",
        "Make up a fairy tale about how we met",
        "Create a romantic commercial about our relationship",

        // Creative Expression
        "Draw our future dream house",
        "Create a heart using items around us",
        "Make me a piece of jewelry from available items",
        "Design our perfect date on paper",
        "Create a symbolic art piece about our love",
        "Write a headline about our future together",
        "Design a logo for our relationship",
        "Create a relationship timeline with drawings",
        "Make up a secret handshake for us",
        "Design a couple's superhero costume",

        // Sweet Actions
        "Give me a five-minute hand massage",
        "Style my hair in a romantic way",
        "Create a romantic atmosphere in 2 minutes",
        "Make me a tiny gift from nearby items",
        "Plan a surprise date right now",
        "Create a romantic playlist in 3 minutes",
        "Write love notes and hide them for me to find",
        "Feed me my favorite snack blindfolded",
        "Create a romantic photo pose",
        "Make me laugh without using words",

        // Fun Challenges
        "Text my best friend about how amazing I am",
        "Post a cute couple photo with a sweet caption",
        "Call your mom and tell her why you love me",
        "Send me a voice message expressing your love",
        "Write down 10 reasons why you love me in 1 minute",
        "Create a relationship bucket list in 2 minutes",
        "Make up a dance move named after me",
        "Imitate how I laugh",
        "Act out our first kiss",
        "Recreate our first date in miniature",

        // Adventure & Fun
        "Let's take a spontaneous selfie in a creative pose",
        "Plan an imaginary vacation in detail",
        "Create a romantic scavenger hunt clue",
        "Invent a signature couple's drink",
        "Make up a story about how we'll meet in another life",
        "Create a romantic ritual for us",
        "Design our perfect date night menu",
        "Choreograph a 30-second couple's dance",
        "Plan our dream wedding in 3 minutes",
        "Create a romantic time capsule message"
    ]
};

const wouldYouRatherQuestions = [
    // Adventure & Travel
    "Would you rather explore ancient ruins together or discover a hidden beach?",
    "Would you rather go on an unplanned road trip or a carefully planned vacation?",
    "Would you rather travel by train through mountains or sail between islands?",
    "Would you rather go backpacking in Europe or luxury resort-hopping in Asia?",
    "Would you rather live in a different country every year or build a dream home in one place?",
    "Would you rather explore underwater caves or climb mountain peaks together?",
    "Would you rather go on a food tour of Italy or a temple tour of Japan?",
    "Would you rather travel by vintage car or luxury yacht?",
    "Would you rather explore a rainforest or trek through a desert?",
    "Would you rather visit the Northern Lights or the Great Barrier Reef?",

    // Romance & Intimacy
    "Would you rather have daily morning cuddles or nightly stargazing sessions?",
    "Would you rather write love letters or create video messages?",
    "Would you rather have a private chef cook for us or cook together every night?",
    "Would you rather dance in the rain or kiss in the snow?",
    "Would you rather have surprise dates or plan them together?",
    "Would you rather have romantic picnics or candlelit dinners?",
    "Would you rather learn couple's massage or take dance lessons?",
    "Would you rather have breakfast in bed or midnight snacks?",
    "Would you rather share a bubble bath or shower together?",
    "Would you rather give or receive romantic gestures?",

    // Home & Living
    "Would you rather have a cozy cottage or a modern penthouse?",
    "Would you rather have a huge garden or a rooftop terrace?",
    "Would you rather have a home theater or a game room?",
    "Would you rather have a luxury kitchen or a spa bathroom?",
    "Would you rather have a library or an art studio?",
    "Would you rather have a pool or a hot tub?",
    "Would you rather have a wine cellar or a coffee bar?",
    "Would you rather have a meditation room or a home gym?",
    "Would you rather have a walk-in closet or a craft room?",
    "Would you rather have a fireplace or floor-to-ceiling windows?",

    // Entertainment & Activities
    "Would you rather go to concerts or comedy shows?",
    "Would you rather play video games or board games together?",
    "Would you rather do pottery or painting classes?",
    "Would you rather go bowling or mini-golfing?",
    "Would you rather do karaoke or dance competitions?",
    "Would you rather watch sports or movies together?",
    "Would you rather go to theme parks or water parks?",
    "Would you rather do escape rooms or murder mystery parties?",
    "Would you rather go camping or glamping?",
    "Would you rather do yoga or martial arts together?",

    // Food & Dining
    "Would you rather try exotic foods or comfort foods?",
    "Would you rather have fancy brunches or elegant dinners?",
    "Would you rather do wine tasting or beer brewing?",
    "Would you rather learn sushi making or pasta making?",
    "Would you rather have street food tours or Michelin star restaurants?",
    "Would you rather have dessert first or multiple main courses?",
    "Would you rather do cooking competitions or baking challenges?",
    "Would you rather have romantic picnics or rooftop dining?",
    "Would you rather learn mixology or barista skills?",
    "Would you rather have food truck adventures or fine dining experiences?",

    // Celebrations & Special Occasions
    "Would you rather have a big wedding or an intimate elopement?",
    "Would you rather celebrate anniversaries with trips or parties?",
    "Would you rather have surprise gifts or planned presents?",
    "Would you rather have birthday adventures or relaxing celebrations?",
    "Would you rather have holiday traditions or spontaneous celebrations?",
    "Would you rather have formal events or casual gatherings?",
    "Would you rather host parties or attend as guests?",
    "Would you rather have themed celebrations or classic events?",
    "Would you rather have morning celebrations or evening parties?",
    "Would you rather have photo shoots or video diaries of events?",

    // Future Plans & Dreams
    "Would you rather retire early to travel or build a successful empire together?",
    "Would you rather have a large family or focus on just us two?",
    "Would you rather live near family or create our own adventure somewhere new?",
    "Would you rather save for our dream home or travel the world first?",
    "Would you rather start a business together or pursue separate careers?",
    "Would you rather focus on experiences or material comfort?",
    "Would you rather live in the city or countryside long-term?",
    "Would you rather have pets or plants?",
    "Would you rather prioritize work-life balance or career growth?",
    "Would you rather plan far ahead or live spontaneously?",

    // Lifestyle & Habits
    "Would you rather be morning people or night owls together?",
    "Would you rather have active dates or relaxing ones?",
    "Would you rather spend on experiences or possessions?",
    "Would you rather have regular date nights or spontaneous adventures?",
    "Would you rather have shared or separate hobbies?",
    "Would you rather have matching outfits or complementary styles?",
    "Would you rather have joint or separate bank accounts?",
    "Would you rather have structured routines or flexible schedules?",
    "Would you rather have social gatherings or private time together?",
    "Would you rather have digital or physical photo albums?"
];

const twentyQuestions = [
    // Childhood & Growing Up
    "What was my favorite childhood toy?",
    "Who was my childhood best friend?",
    "What was my favorite game to play at recess?",
    "What was my most embarrassing school moment?",
    "What was my favorite birthday party theme?",
    "What was my first concert or live show?",
    "What was my favorite place to visit as a kid?",
    "What was my childhood dream job?",
    "What was my favorite bedtime story?",
    "What was my favorite holiday tradition?",
    "What was my favorite cartoon character?",
    "What was my first phone model?",
    "What was my favorite school subject?",
    "What was my least favorite vegetable?",
    "What was my favorite playground activity?",

    // Family & Relationships
    "Who am I closest to in my family?",
    "What's my favorite family tradition?",
    "What's my relationship like with my siblings?",
    "Who was my first crush?",
    "What's my favorite family vacation memory?",
    "What's my parents' love story?",
    "What's my favorite family recipe?",
    "What's my role in family gatherings?",
    "What's my favorite way to spend family time?",
    "What family trait did I inherit?",
    "What's my favorite childhood family photo?",
    "What's my most treasured family heirloom?",
    "What's my favorite family celebration?",
    "What's my family nickname?",
    "What's my favorite family story to tell?",

    // Personal Tastes & Preferences
    "What's my favorite scent?",
    "What's my preferred room temperature?",
    "What's my ideal wake-up time?",
    "What's my favorite type of weather?",
    "What's my preferred seat on a plane?",
    "What's my favorite time of year?",
    "What's my ideal noise level for working?",
    "What's my preferred lighting style?",
    "What's my favorite texture?",
    "What's my ideal room layout?",
    "What's my favorite color combination?",
    "What's my preferred sleeping position?",
    "What's my ideal shopping experience?",
    "What's my favorite way to relax?",
    "What's my preferred social setting?",

    // Food & Drink Detailed
    "What's my perfect breakfast?",
    "What's my favorite coffee/tea preparation?",
    "What's my go-to midnight snack?",
    "What's my favorite cuisine?",
    "What's my most-used condiment?",
    "What's my favorite food combination?",
    "What's my preferred cooking method?",
    "What's my favorite restaurant atmosphere?",
    "What's my ideal food temperature?",
    "What's my favorite cooking show?",
    "What's my must-have kitchen gadget?",
    "What's my favorite food memory?",
    "What's my preferred wine type?",
    "What's my favorite food texture?",
    "What's my ideal meal time?",

    // Entertainment Deep Dive
    "What's my favorite movie quote?",
    "What's my go-to karaoke song?",
    "What's my favorite book genre?",
    "What's my most-watched TV series?",
    "What's my favorite type of music to work to?",
    "What's my favorite podcast genre?",
    "What's my ideal movie snack?",
    "What's my favorite video game character?",
    "What's my preferred music era?",
    "What's my favorite art style?",
    "What's my favorite board game strategy?",
    "What's my favorite movie soundtrack?",
    "What's my preferred gaming platform?",
    "What's my favorite type of performance art?",
    "What's my favorite way to discover new music?",

    // Travel & Adventure
    "What's my dream travel destination?",
    "What's my preferred method of travel?",
    "What's my ideal vacation length?",
    "What's my favorite type of accommodation?",
    "What's my must-have travel item?",
    "What's my favorite travel memory?",
    "What's my preferred vacation activity?",
    "What's my ideal travel companion type?",
    "What's my favorite type of landscape?",
    "What's my preferred climate for travel?",
    "What's my dream adventure activity?",
    "What's my favorite cultural experience?",
    "What's my travel photography style?",
    "What's my preferred packing style?",
    "What's my favorite travel souvenir type?",

    // Career & Ambitions
    "What's my dream job environment?",
    "What's my preferred work schedule?",
    "What's my ideal team size?",
    "What's my leadership style?",
    "What's my career motivation?",
    "What's my preferred industry?",
    "What's my dream work location?",
    "What's my ideal work-life balance?",
    "What's my professional strength?",
    "What's my preferred communication style?",
    "What's my dream project?",
    "What's my ideal mentor type?",
    "What's my preferred learning style?",
    "What's my career backup plan?",
    "What's my dream professional achievement?",

    // Habits & Routines
    "What's my morning ritual?",
    "What's my exercise preference?",
    "What's my productivity peak time?",
    "What's my stress relief method?",
    "What's my social media habit?",
    "What's my weekend routine?",
    "What's my cleaning schedule?",
    "What's my shopping pattern?",
    "What's my self-care routine?",
    "What's my bedtime ritual?",
    "What's my organization system?",
    "What's my time management style?",
    "What's my fitness goal?",
    "What's my reading habit?",
    "What's my creative outlet?"
];

// Add this function to get random questions without repeats
function getRandomQuestion(type) {
    const questions = type === 'truth' || type === 'dare' ? 
        truthOrDareQuestions[type] : 
        type === 'wouldYouRather' ? 
            wouldYouRatherQuestions : 
            twentyQuestions;
    
    // Get a random question
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
} 

// Add this function to handle starting games
function startGame(gameType) {
    const gameContent = document.querySelector('.game-content');
    const gamesGrid = document.querySelector('.games-grid');
    
    // Hide the game selection grid
    gamesGrid.style.display = 'none';
    
    // Create game interface
    const gameInterface = document.createElement('div');
    gameInterface.className = 'game-interface';
    
    // Add back button
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '← Back to Games';
    backButton.onclick = () => {
        gameInterface.remove();
        gamesGrid.style.display = 'grid';
    };
    
    // Add question display
    const questionDisplay = document.createElement('div');
    questionDisplay.className = 'question-display';
    
    // Add game buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'game-buttons';
    
    if (gameType === 'truth-or-dare') {
        // Truth or Dare buttons
        const truthButton = document.createElement('button');
        truthButton.textContent = 'Truth';
        truthButton.onclick = () => {
            questionDisplay.textContent = getRandomQuestion('truth');
            createHeartExplosion(event.clientX, event.clientY);
        };
        
        const dareButton = document.createElement('button');
        dareButton.textContent = 'Dare';
        dareButton.onclick = () => {
            questionDisplay.textContent = getRandomQuestion('dare');
            createHeartExplosion(event.clientX, event.clientY);
        };
        
        buttonsContainer.appendChild(truthButton);
        buttonsContainer.appendChild(dareButton);
    } else {
        // Would You Rather and 20 Questions
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next Question';
        nextButton.onclick = () => {
            questionDisplay.textContent = getRandomQuestion(gameType);
            createHeartExplosion(event.clientX, event.clientY);
        };
        
        buttonsContainer.appendChild(nextButton);
    }
    
    // Assemble the game interface
    gameInterface.appendChild(backButton);
    gameInterface.appendChild(questionDisplay);
    gameInterface.appendChild(buttonsContainer);
    
    // Show first question
    questionDisplay.textContent = getRandomQuestion(gameType);
    
    // Add the game interface to the content area
    gameContent.appendChild(gameInterface);
}

// Add these variables at the top of script.js
let partner1Name = '';
let partner2Name = '';

// Add this function to handle name inputs
function setupCoupleNames() {
    const nameForm = document.createElement('div');
    nameForm.className = 'couple-names-form';
    nameForm.innerHTML = `
        <div class="names-container">
            <h3>Your Names</h3>
            <div class="name-input-group">
                <input type="text" id="partner1" placeholder="Partner 1's name" 
                    value="${partner1Name}" maxlength="12">
                <span class="heart-separator">❤</span>
                <input type="text" id="partner2" placeholder="Partner 2's name"
                    value="${partner2Name}" maxlength="12">
            </div>
            <button class="save-names-btn" onclick="saveNames()">Save Names</button>
        </div>
    `;
    
    document.querySelector('.page-container').prepend(nameForm);
    
    // Update click listener to only trigger on background clicks
    document.addEventListener('click', (e) => {
        // Check if click is on the background (not on any content)
        if (e.target.classList.contains('particles-background') || 
            e.target.classList.contains('hearts-bg') || 
            e.target === document.body) {
            createNameHearts(e.clientX, e.clientY);
        }
    });
}

// Add this function to save names
function saveNames() {
    partner1Name = document.getElementById('partner1').value.trim();
    partner2Name = document.getElementById('partner2').value.trim();
    localStorage.setItem('partner1Name', partner1Name);
    localStorage.setItem('partner2Name', partner2Name);
    createHeartExplosion(event.clientX, event.clientY);
}

// Add this function to create hearts with names
function createNameHearts(x, y) {
    if (!partner1Name && !partner2Name) return;
    
    const hearts = 12;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    for (let i = 0; i < hearts; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = i % 3 === 0 ? partner1Name : 
                         i % 3 === 1 ? '💖' : partner2Name;
        heart.className = 'name-heart';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = Math.random() * 10 + 15 + 'px';
        heart.style.color = i % 3 === 1 ? '#e63946' : '#2d3436';
        
        const angle = (i / hearts) * Math.PI * 2;
        const velocity = 2 + Math.random() * 2;
        const delay = Math.random() * 100;

        heart.style.setProperty('--angle', angle + 'rad');
        heart.style.setProperty('--velocity', velocity);
        heart.style.setProperty('--delay', delay + 'ms');
        heart.style.setProperty('--random-float', Math.random());

        container.appendChild(heart);
    }

    setTimeout(() => container.remove(), 2000);
}

// Add this to your existing DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    // Load saved names
    partner1Name = localStorage.getItem('partner1Name') || '';
    partner2Name = localStorage.getItem('partner2Name') || '';

    // Hide all content initially
    document.querySelector('.page-container').style.display = 'none';
    document.querySelector('.particles-background').style.display = 'none';
    document.querySelector('.hearts-bg').style.display = 'none';

    // If names aren't saved, show intro; otherwise, show main content
    if (!partner1Name || !partner2Name) {
        showIntroSequence();
    } else {
        showMainContent();
    }
});

// Update this listener to only show the intro form
document.addEventListener('DOMContentLoaded', () => {
    // Create and show the name input form
    const nameForm = document.createElement('div');
    nameForm.className = 'intro-form';
    
    nameForm.innerHTML = `
        <div id="particles-js-intro" class="particles-background"></div>
        <div class="hearts-bg"></div>
        <div class="names-container">
            <h1>Plan Your Perfect Date</h1>
            <h3>Your Names</h3>
            <div class="name-input-group">
                <input type="text" id="partner1" placeholder="Partner 1's name" maxlength="12">
                <span class="heart-separator">❤</span>
                <input type="text" id="partner2" placeholder="Partner 2's name" maxlength="12">
            </div>
            <button class="start-journey-btn" onclick="startJourney()">Start Planning Your Perfect Date</button>
        </div>
    `;
    document.body.appendChild(nameForm);

    // Initialize particles for the intro form
    particlesJS("particles-js-intro", {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": { "value": "#e63946" },
            "shape": { "type": "circle" },
            "opacity": {
                "value": 0.5,
                "random": true
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#e63946",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "bounce",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            }
        },
        "retina_detect": true
    });

    // Hide the main content
    const pageContainer = document.querySelector('.page-container');
    if (pageContainer) pageContainer.style.display = 'none';
});

// Update startJourney to include heart explosion
function startJourney() {
    const partner1 = document.getElementById('partner1').value.trim();
    const partner2 = document.getElementById('partner2').value.trim();
    
    if (!partner1 || !partner2) {
        alert('Please enter both names to continue');
        return;
    }

    // Save the names
    partner1Name = partner1;
    partner2Name = partner2;
    localStorage.setItem('partner1Name', partner1Name);
    localStorage.setItem('partner2Name', partner2Name);

    // Create heart explosion effect at center of screen
    createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);

    // Remove the intro form after a slight delay
    setTimeout(() => {
        document.querySelector('.intro-form').remove();
        
        // Show all main content
        document.querySelector('.page-container').style.display = 'block';
        document.querySelector('.particles-background').style.display = 'block';
        document.querySelector('.hearts-bg').style.display = 'block';
        document.querySelector('.page-container').classList.add('fade-in');

        // Add click listener for background hearts
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('particles-background') || 
                e.target.classList.contains('hearts-bg') || 
                e.target === document.body) {
                createNameHearts(e.clientX, e.clientY);
            }
        });
    }, 500);
}

// Add this to your existing movies section HTML structure
function makeMoviesSectionCollapsible() {
    const moviesSection = document.querySelector('.movies-section');
    const content = moviesSection.innerHTML;
    
    moviesSection.innerHTML = `
        <div class="collapsible-header" onclick="toggleMovies(this)">
            <h2>Movies Now Showing</h2>
            <span class="collapse-icon">▼</span>
        </div>
        <div class="collapsible-content">
            ${content}
        </div>
    `;
}

function toggleMovies(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.collapse-icon');
    
    content.classList.toggle('expanded');
    icon.classList.toggle('expanded');
    
    // Only fetch movies if we're expanding and haven't loaded them yet
    if (content.classList.contains('expanded') && 
        !content.querySelector('.movie-card')) {
        fetchNowPlayingMovies();
    }
}

// Add this to your DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    makeMoviesSectionCollapsible();
});

// Add this to your existing JavaScript
let countdownInterval;

function startCountdown() {
    const dateInput = document.getElementById('dateTime');
    const targetDate = new Date(dateInput.value).getTime();
    
    // Clear any existing countdown
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // Save the date to localStorage
    localStorage.setItem('nextDateNight', targetDate);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-display').innerHTML = `
                <div class="date-night-alert">
                    <span>It's Date Night! 💝</span>
                    <button onclick="startCountdown()" class="new-date-btn">Set Next Date</button>
                </div>
            `;
            createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // Update immediately and then every second
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...

    // Check for saved date night and start countdown if exists
    const savedDate = localStorage.getItem('nextDateNight');
    if (savedDate) {
        const dateInput = document.getElementById('dateTime');
        dateInput.value = new Date(parseInt(savedDate)).toISOString().slice(0, 16);
        startCountdown();
    }
});

// Love Languages Quiz
const loveLanguagesQuestions = [
    {
        question: "When I feel most loved, it's when:",
        options: {
            A: "Someone tells me they appreciate me",
            B: "Someone helps me with a task",
            C: "I receive an unexpected gift",
            D: "I spend uninterrupted time with someone",
            E: "I get a warm hug or cuddle"
        }
    },
    {
        question: "I would rather my partner:",
        options: {
            A: "Compliment me",
            B: "Do my chores when I'm overwhelmed",
            C: "Surprise me with something thoughtful",
            D: "Plan a day just for us",
            E: "Hold my hand in public"
        }
    },
    {
        question: "I feel disconnected when:",
        options: {
            A: "I don't hear kind words",
            B: "People don't pitch in when I need help",
            C: "No one gives me anything personal",
            D: "I don't get time alone with loved ones",
            E: "Physical affection is lacking"
        }
    },
    {
        question: "On a special day, I'd love:",
        options: {
            A: "A heartfelt letter",
            B: "Breakfast in bed",
            C: "A carefully chosen gift",
            D: "A cozy movie night",
            E: "A massage or cuddle session"
        }
    },
    {
        question: "When I'm upset, I want:",
        options: {
            A: "Someone to speak encouragement",
            B: "Help solving the issue",
            C: "A surprise coffee or treat",
            D: "Someone to sit and listen to me",
            E: "To be hugged"
        }
    },
    {
        question: "I show love by:",
        options: {
            A: "Saying nice things",
            B: "Doing things for others",
            C: "Giving meaningful gifts",
            D: "Making time for others",
            E: "Giving hugs or touch"
        }
    },
    {
        question: "I feel most hurt when:",
        options: {
            A: "Someone criticizes me",
            B: "Someone doesn't help me",
            C: "Someone forgets a gift or occasion",
            D: "Someone cancels plans",
            E: "Someone is physically distant"
        }
    },
    {
        question: "I feel closest to someone when:",
        options: {
            A: "They affirm me verbally",
            B: "We work together",
            C: "They gift me thoughtfully",
            D: "We talk for hours",
            E: "We're physically affectionate"
        }
    },
    {
        question: "I appreciate a partner who:",
        options: {
            A: "Encourages me regularly",
            B: "Is always helpful",
            C: "Brings me treats",
            D: "Spends quality time with me",
            E: "Loves to touch me"
        }
    },
    {
        question: "My ideal date is:",
        options: {
            A: "A deep conversation over dinner",
            B: "A picnic they prepared for me",
            C: "A surprise gift with a sweet note",
            D: "A long walk and talk",
            E: "Snuggling up watching a movie"
        }
    },
    {
        question: "I get emotional when:",
        options: {
            A: "Someone tells me I inspire them",
            B: "Someone goes out of their way to help",
            C: "Someone surprises me with something just because",
            D: "Someone cancels their plans to be with me",
            E: "I'm given affection when I need comfort"
        }
    },
    {
        question: "When choosing a partner, I value:",
        options: {
            A: "Good communication",
            B: "Dependability",
            C: "Thoughtfulness",
            D: "Presence",
            E: "Physical chemistry"
        }
    },
    {
        question: "I think love is best shown through:",
        options: {
            A: "Words",
            B: "Actions",
            C: "Tokens",
            D: "Time",
            E: "Touch"
        }
    },
    {
        question: "I light up when:",
        options: {
            A: "I get sincere compliments",
            B: "Someone lends a helping hand",
            C: "I unwrap something special",
            D: "I have deep time together",
            E: "I'm kissed or touched"
        }
    },
    {
        question: "If I had to go a week without one, I'd struggle most with:",
        options: {
            A: "Compliments",
            B: "Help with tasks",
            C: "Gifts",
            D: "Time together",
            E: "Physical contact"
        }
    },
    {
        question: "I admire people who:",
        options: {
            A: "Are expressive and kind with words",
            B: "Show up and do the hard work",
            C: "Are thoughtful gift-givers",
            D: "Always make time for loved ones",
            E: "Are affectionate and warm"
        }
    },
    {
        question: "On my birthday, I look forward to:",
        options: {
            A: "Kind words and posts",
            B: "Someone doing something for me",
            C: "The gift I get",
            D: "Time spent together",
            E: "All the hugs and kisses"
        }
    },
    {
        question: "When someone cancels on me, I:",
        options: {
            A: "Feel unimportant",
            B: "Wish they had offered help another time",
            C: "Feel forgotten",
            D: "Feel let down",
            E: "Miss the closeness"
        }
    },
    {
        question: "A romantic gesture I'd love is:",
        options: {
            A: "A handwritten letter",
            B: "Them taking over a responsibility",
            C: "A handmade or meaningful present",
            D: "An adventure day",
            E: "A spontaneous kiss"
        }
    },
    {
        question: "Love means:",
        options: {
            A: "Words that build you up",
            B: "Actions that show commitment",
            C: "Giving from the heart",
            D: "Shared time and presence",
            E: "Touch that connects souls"
        }
    }
];

let currentQuestionIndex = 0;
const scores = {
    A: 0, // Words of Affirmation
    B: 0, // Acts of Service
    C: 0, // Receiving Gifts
    D: 0, // Quality Time
    E: 0  // Physical Touch
};

const loveLanguageNames = {
    A: "Words of Affirmation",
    B: "Acts of Service",
    C: "Receiving Gifts",
    D: "Quality Time",
    E: "Physical Touch"
};

function startLoveLanguagesQuiz() {
    currentQuestionIndex = 0;
    Object.keys(scores).forEach(key => scores[key] = 0);
    
    document.getElementById('start-quiz').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('results-container').style.display = 'none';
    showQuestion(0);
}

function showQuestion(index) {
    const question = loveLanguagesQuestions[index];
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.querySelector('.options-container');
    optionsContainer.innerHTML = Object.entries(question.options)
        .map(([key, text]) => `
            <button class="option-btn" onclick="selectOption('${key}')">
                <span class="option-letter">${key}</span>
                ${text}
            </button>
        `).join('');
    
    document.getElementById('current-question').textContent = index + 1;
    document.getElementById('total-questions').textContent = loveLanguagesQuestions.length;
    
    // Update progress bar
    const progress = ((index + 1) / loveLanguagesQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function selectOption(option) {
    scores[option]++;
    
    // Highlight selected option
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.querySelector('.option-letter').textContent === option) {
            btn.classList.add('selected');
        }
    });
    
    // Add delay before next question
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < loveLanguagesQuestions.length) {
            showQuestion(currentQuestionIndex);
        } else {
            showResults();
        }
    }, 500);
}

function showResults() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';

    // Calculate total score
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    
    // Update each bar with animation
    Object.entries(scores).forEach(([key, score]) => {
        const language = loveLanguageNames[key];
        const percentage = (score / total) * 100;
        const barId = language.toLowerCase().replace(/\s+/g, '-');
        const barElement = document.getElementById(`${barId}-bar`);
        
        if (barElement) {
            const bar = barElement.querySelector('.bar');
            const percentageSpan = barElement.querySelector('.percentage');
            
            // Animate the bar filling
            setTimeout(() => {
                bar.style.width = `${percentage}%`;
                percentageSpan.textContent = `${Math.round(percentage)}%`;
            }, 100);
        }
    });

    // Sort scores to find primary love language
    const sortedScores = Object.entries(scores)
        .sort(([,a], [,b]) => b - a);
    
    const primaryLanguage = loveLanguageNames[sortedScores[0][0]];
    const interpretation = getInterpretation(primaryLanguage);
    
    // Show interpretation with animation
    const interpretationElement = document.getElementById('interpretation');
    interpretationElement.innerHTML = `
        <h4>Your Primary Love Language is ${primaryLanguage}</h4>
        <p>${interpretation}</p>
    `;
}

function getInterpretation(language) {
    const interpretations = {
        "Words of Affirmation": "You thrive on verbal appreciation. Kind words, encouragement, and hearing 'I love you' light you up. Written or spoken expressions of affection are your emotional fuel.",
        "Acts of Service": "Actions speak louder than words for you. You feel most loved when people do helpful things for you. Small acts of service make your heart sing.",
        "Receiving Gifts": "For you, it's the thought that counts. Meaningful gifts and thoughtful gestures, no matter how small, make you feel special and remembered.",
        "Quality Time": "You value undivided attention and meaningful connection. Deep conversations and focused time together make you feel most loved.",
        "Physical Touch": "Physical connection is important to you. Hugs, kisses, and gentle touches make you feel secure and loved. Physical presence speaks volumes."
    };
    
    return interpretations[language];
} 

const dateNightChallenges = {
    "Paint Together 🎨": {
        description: "Create art together",
        subChallenges: [
            "Paint each other's portraits",
            "Create a sunset landscape",
            "Paint your dream house",
            "Draw your favorite memory together",
            "Paint your future pets",
            "Create abstract art with your favorite colors",
            "Paint your perfect date scene",
            "Draw each other with your non-dominant hand",
            "Create a joint masterpiece without talking",
            "Paint your favorite food"
        ]
    },
    "Cook Together 👩‍🍳": {
        description: "Culinary adventures",
        subChallenges: [
            "Make heart-shaped pancakes",
            "Create a dish from your favorite movie",
            "Cook a meal using only red ingredients",
            "Bake cookies and decorate them as each other",
            "Make a romantic three-course dinner",
            "Create your own pizza toppings",
            "Make dessert blindfolded",
            "Cook a dish from your childhood",
            "Create a new recipe together",
            "Make chocolate-covered strawberries"
        ]
    },
    "Dance Challenge 💃": {
        description: "Move together",
        subChallenges: [
            "Learn a TikTok dance",
            "Slow dance to your favorite song",
            "Create your own couple's dance",
            "Dance to different genres for 1 minute each",
            "Recreate a famous movie dance scene",
            "Dance while balancing books on your heads",
            "Mirror each other's dance moves",
            "Dance without music",
            "Create a romantic waltz",
            "Dance while only holding one hand"
        ]
    },
    "Photo Shoot 📸": {
        description: "Capture memories",
        subChallenges: [
            "Recreate your first date photos",
            "Take silly face portraits",
            "Create a romantic silhouette shot",
            "Take photos in 5 different poses",
            "Recreate famous couple photos",
            "Take candid shots of each other",
            "Create a photo story of your love",
            "Take matching outfit photos",
            "Create heart shapes with shadows",
            "Take photos from unusual angles"
        ]
    },
    "Write Together ✍️": {
        description: "Express your love in words",
        subChallenges: [
            "Write a love poem for each other",
            "Create a story about how you met",
            "Write your future bucket list",
            "Compose a song about your love",
            "Write letters to your future selves",
            "Create a romantic acrostic poem",
            "Write 10 things you love about each other",
            "Create your love story in emojis",
            "Write your perfect date description",
            "Create your own wedding vows"
        ]
    }
};

function getRandomChallenge() {
    const challenges = Object.keys(dateNightChallenges);
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    return {
        main: randomChallenge,
        description: dateNightChallenges[randomChallenge].description
    };
}

function getRandomSubChallenge(mainChallenge) {
    const subChallenges = dateNightChallenges[mainChallenge].subChallenges;
    return subChallenges[Math.floor(Math.random() * subChallenges.length)];
}

function showChallenge() {
    const result = document.getElementById('challenge-result');
    const challenge = getRandomChallenge();
    
    result.innerHTML = `
        <div class="challenge-card">
            <h3>${challenge.main}</h3>
            <p>${challenge.description}</p>
            <button onclick="showSubChallenge('${challenge.main}')" class="get-task-btn">
                Get Your Task
            </button>
        </div>
    `;
    
    // Add animation
    result.classList.remove('show');
    setTimeout(() => result.classList.add('show'), 10);
    createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
}

function showSubChallenge(mainChallenge) {
    const result = document.getElementById('challenge-result');
    const subChallenge = getRandomSubChallenge(mainChallenge);
    
    result.innerHTML = `
        <div class="challenge-card">
            <h3>${mainChallenge}</h3>
            <div class="sub-challenge">
                <p class="task-text">${subChallenge}</p>
                <button onclick="showChallenge()" class="new-challenge-btn">
                    Try Another Challenge
                </button>
            </div>
        </div>
    `;
    
    // Add animation
    createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
} 

// Add these functions to your existing script.js
function buildDrinkURL(drinkSearchValue) {
    return fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drinkSearchValue}`)
        .then(response => response.json())
        .then(response => {
            const drinkLength = response.drinks.length;
            const randomNumber = Math.floor(Math.random() * drinkLength);
            const drinkID = response.drinks[randomNumber].idDrink;
            
            return fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
                .then(response => response.json());
        });
}

function buildMealURL(mealSearchValue) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${mealSearchValue}`)
        .then(response => response.json())
        .then(response => {
            const foodArrayLength = response.meals.length;
            const mathRandomNumber = Math.floor(Math.random() * foodArrayLength);
            const foodID = response.meals[mathRandomNumber].idMeal;
            
            return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodID}`)
                .then(response => response.json());
        });
}

function displayDrinkAndMeal(drink, meal) {
    const diningContent = document.querySelector('.dining-options');
    diningContent.innerHTML = `
        <div class="recipe-results">
            <div class="recipe-card drink-card">
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <h3>${drink.strDrink}</h3>
                <div class="recipe-details">
                    <h4>Ingredients:</h4>
                    <ul>
                        ${getIngredientsList(drink)}
                    </ul>
                    <h4>Instructions:</h4>
                    <p>${drink.strInstructions}</p>
                </div>
            </div>
            
            <div class="recipe-card meal-card">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <div class="recipe-details">
                    <h4>Ingredients:</h4>
                    <ul>
                        ${getIngredientsList(meal)}
                    </ul>
                    <h4>Instructions:</h4>
                    <p>${meal.strInstructions}</p>
                    ${meal.strSource ? `<a href="${meal.strSource}" target="_blank" class="recipe-link">View Full Recipe</a>` : ''}
                </div>
            </div>
        </div>
        <button onclick="showDiningSelectors()" class="try-again-btn">Try Different Cuisine</button>
    `;
}

function getIngredientsList(recipe) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients += `<li>${measure ? measure + ' ' : ''}${ingredient}</li>`;
        }
    }
    return ingredients;
}

function showDiningSelectors() {
    const diningContent = document.querySelector('.dining-options');
    diningContent.innerHTML = `
        <div class="selectors-container">
            <div class="cuisine-selector">
                <h3>Choose Your Cuisine</h3>
                <select id="meal-searched" class="romantic-select">
                    <option value="Random">Random</option>
                    <option value="American">American</option>
                    <option value="Chinese">Chinese</option>
                    <option value="French">French</option>
                    <option value="Indian">Indian</option>
                    <option value="Italian">Italian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Thai">Thai</option>
                </select>
            </div>
            
            <div class="drink-selector">
                <h3>Choose Your Drink</h3>
                <select id="drink-selected" class="romantic-select">
                    <option value="Random">Random</option>
                    <option value="gin">Gin</option>
                    <option value="vodka">Vodka</option>
                    <option value="rum">Rum</option>
                    <option value="tequila">Tequila</option>
                    <option value="whiskey">Whiskey</option>
                </select>
            </div>
            
            <button onclick="generateMealAndDrink()" class="generate-btn">
                Create Your Perfect Pairing
            </button>
        </div>
    `;
}

function generateMealAndDrink() {
    const mealSelect = document.getElementById('meal-searched');
    const drinkSelect = document.getElementById('drink-selected');
    
    let mealValue = mealSelect.value;
    let drinkValue = drinkSelect.value;
    
    if (mealValue === 'Random') {
        const cuisines = ['American', 'Chinese', 'French', 'Indian', 'Italian', 'Japanese', 'Mexican', 'Thai'];
        mealValue = cuisines[Math.floor(Math.random() * cuisines.length)];
    }
    
    if (drinkValue === 'Random') {
        const drinks = ['gin', 'vodka', 'rum', 'tequila', 'whiskey'];
        drinkValue = drinks[Math.floor(Math.random() * drinks.length)];
    }
    
    Promise.all([
        buildDrinkURL(drinkValue),
        buildMealURL(mealValue)
    ])
    .then(([drinkResponse, mealResponse]) => {
        displayDrinkAndMeal(drinkResponse.drinks[0], mealResponse.meals[0]);
        createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Add these functions to your script.js
async function getRecommendation() {
    const genreSelect = document.getElementById('genre-select');
    const yearRange = document.getElementById('year-range');
    const selectedGenre = genreSelect.value;
    const contentType = document.querySelector('.type-btn.active').dataset.type;
    const result = document.getElementById('recommendation-result');
    
    if (contentType === 'tv') {
        // Use OMDB API for TV series
        try {
            // Get genre name instead of ID for OMDB
            const genreName = genreSelect.options[genreSelect.selectedIndex].text;
            
            // Map TMDB genres to more general search terms for OMDB
            const searchTerms = {
                'Romance': ['romantic series', 'romance drama', 'love story series', 'romantic comedy series'],
                'Comedy': ['comedy series', 'sitcom', 'popular sitcom', 'hit comedy series'],
                'Drama': ['drama series', 'hit drama series', 'award winning drama', 'popular drama'],
                'Horror': ['horror series', 'supernatural series', 'thriller series', 'horror drama'],
                'Action': ['action series', 'action drama', 'thriller series', 'hit action series'],
                'Adventure': ['adventure series', 'epic series', 'fantasy adventure', 'hit adventure series'],
                'Animation': ['animated series', 'popular cartoon', 'hit animated series', 'adult animation'],
                'Crime': ['crime series', 'detective series', 'police drama', 'hit crime series'],
                'Documentary': ['documentary series', 'popular documentary', 'hit documentary series'],
                'Fantasy': ['fantasy series', 'supernatural series', 'hit fantasy series'],
                'History': ['historical drama', 'period series', 'history series', 'hit historical series'],
                'Mystery': ['mystery series', 'detective series', 'thriller series', 'hit mystery series'],
                'Science Fiction': ['sci-fi series', 'science fiction series', 'hit sci-fi series'],
                'Thriller': ['thriller series', 'suspense series', 'hit thriller series']
            };

            // Add popular series fallbacks
            const popularSeriesTerms = [
                'breaking bad',
                'game of thrones',
                'stranger things',
                'the crown',
                'friends',
                'the office',
                'black mirror',
                'westworld',
                'the mandalorian',
                'chernobyl',
                'true detective',
                'the wire',
                'fargo',
                'better call saul',
                'the sopranos',
                'band of brothers',
                'the witcher',
                'bridgerton',
                'succession',
                'ted lasso'
            ];

            // Handle "Surprise Me" option with year consideration
            let searchTerm;
            let yearFilter = '';
            
            if (yearRange.value !== 'all') {
                if (yearRange.value === 'classic') {
                    yearFilter = '&y=1900-1980';
                } else {
                    const [startYear, endYear] = yearRange.value.split(',');
                    yearFilter = `&y=${startYear}`;  // Use start year as anchor point
                }
            }

            if (genreName === 'Surprise Me! 🎲') {
                // Try popular series first
                const randomPopular = popularSeriesTerms[Math.floor(Math.random() * popularSeriesTerms.length)];
                const popularResponse = await fetch(
                    `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${randomPopular}&type=series`
                );
                const popularData = await popularResponse.json();
                
                if (popularData.Response === "True") {
                    searchTerm = randomPopular;
                } else {
                    // Fallback to genre search
                    const genres = Object.keys(searchTerms);
                    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
                    const searchOptions = searchTerms[randomGenre];
                    searchTerm = searchOptions[Math.floor(Math.random() * searchOptions.length)];
                }
            } else {
                // Use genre-specific search with popular shows bias
                const searchOptions = searchTerms[genreName] || [genreName.toLowerCase()];
                let foundResults = false;
                
                // Try each search term
                for (const term of searchOptions) {
                    const testResponse = await fetch(
                        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&type=series&s=${term}${yearFilter}`
                    );
                    const testData = await testResponse.json();
                    
                    if (testData.Response === "True" && testData.Search) {
                        // Filter and sort by popularity (using imdbRating as proxy)
                        const qualityResults = [];
                        for (const show of testData.Search) {
                            const detailsResponse = await fetch(
                                `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${show.imdbID}`
                            );
                            const details = await detailsResponse.json();
                            if (details.imdbRating && details.imdbRating >= 7) {
                                qualityResults.push({...show, rating: parseFloat(details.imdbRating)});
                            }
                        }
                        
                        if (qualityResults.length > 0) {
                            // Sort by rating
                            qualityResults.sort((a, b) => b.rating - a.rating);
                            searchTerm = term;
                            foundResults = true;
                            break;
                        }
                    }
                }
                
                if (!foundResults) {
                    // Fallback to popular shows in that genre
                    searchTerm = `popular ${searchOptions[0]}`;
                }
            }

            // Add quality filters to the main search
            const searchResponse = await fetch(
                `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&type=series&s=${searchTerm}${yearFilter}`
            );
            const searchData = await searchResponse.json();

            if (searchData.Response === "True" && searchData.Search) {
                // Filter out low-quality results
                const qualityResults = searchData.Search.filter(show => 
                    show.Poster !== "N/A" && 
                    !show.Title.toLowerCase().includes("episode")
                );
                
                if (qualityResults.length > 0) {
                    // Get random series from quality results
                    const randomIndex = Math.floor(Math.random() * qualityResults.length);
                    const series = qualityResults[randomIndex];
                    
                    // Get detailed info for the selected series
                    const detailsResponse = await fetch(
                        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${series.imdbID}&plot=full`
                    );
                    const details = await detailsResponse.json();
                    
                    result.innerHTML = `
                        <div class="recommendation-card">
                            <img src="${details.Poster}" 
                                 alt="${details.Title}"
                                 onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'">
                            <div class="recommendation-info">
                                <h3>${details.Title}</h3>
                                <div class="recommendation-meta">
                                    <span class="recommendation-rating">★ ${details.imdbRating}</span>
                                    <span>${details.Year}</span>
                                    <span>${details.totalSeasons} Season${details.totalSeasons > 1 ? 's' : ''}</span>
                                </div>
                                <p>${details.Plot}</p>
                                <div class="genre-tags">
                                    ${details.Genre.split(', ').map(genre => 
                                        `<span class="genre-tag">${genre}</span>`
                                    ).join('')}
                                </div>
                                <div class="cast-list">
                                    <h4>Starring:</h4>
                                    <p>${details.Actors}</p>
                                </div>
                                <div class="additional-info">
                                    <p><strong>Created by:</strong> ${details.Writer}</p>
                                    <p><strong>Awards:</strong> ${details.Awards}</p>
                                    ${details.Ratings ? details.Ratings.map(rating => 
                                        `<p><strong>${rating.Source}:</strong> ${rating.Value}</p>`
                                    ).join('') : ''}
                                </div>
                                <div class="try-another">
                                    <button onclick="getRecommendation()" class="generate-btn">
                                        Try Another
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    result.classList.add('show');
                    createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
                } else {
                    result.innerHTML = '<p class="error-message">No quality series found for these criteria. Try different options!</p>';
                }
            } else {
                result.innerHTML = '<p class="error-message">No series found for these criteria. Try different options!</p>';
            }
        } catch (error) {
            console.error('Error fetching series:', error);
            result.innerHTML = '<p class="error-message">Error getting recommendation. Please try again.</p>';
        }
    } else {
        // Movies using TMDB API
        let genreId = selectedGenre;
        if (selectedGenre === 'random') {
            const genres = Array.from(genreSelect.options)
                .filter(option => option.value !== 'random')
                .map(option => option.value);
            genreId = genres[Math.floor(Math.random() * genres.length)];
        }
        
        // Build date range filter
        let dateFilter = '';
        if (yearRange.value !== 'all') {
            if (yearRange.value === 'classic') {
                dateFilter = '&primary_release_date.lte=1980-12-31';
            } else {
                const [startYear, endYear] = yearRange.value.split(',');
                dateFilter = `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;
            }
        }
        
        try {
            // First get total pages for this genre
            const initialResponse = await fetch(
                `${BASE_URL}/discover/movie?api_key=${API_KEY}&` +
                `with_genres=${genreId}&` +
                `vote_count.gte=100&` +
                `sort_by=popularity.desc&` +
                dateFilter +
                `language=en-US&` +
                `include_adult=false`
            );
            
            const initialData = await initialResponse.json();
            
            if (!initialData.total_results) {
                result.innerHTML = '<p class="error-message">No movies found for these filters. Try different options!</p>';
                return;
            }
            
            const totalPages = Math.min(initialData.total_pages, 20);
            const randomPage = Math.floor(Math.random() * totalPages) + 1;
            
            const response = await fetch(
                `${BASE_URL}/discover/movie?api_key=${API_KEY}&` +
                `with_genres=${genreId}&` +
                `vote_count.gte=100&` +
                `sort_by=popularity.desc&` +
                dateFilter +
                `page=${randomPage}&` +
                `language=en-US&` +
                `include_adult=false`
            );
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const validResults = data.results.filter(item => 
                    item.poster_path && 
                    item.overview && 
                    item.vote_average > 0
                );
                
                if (validResults.length === 0) {
                    result.innerHTML = '<p class="error-message">No good recommendations found. Try different filters!</p>';
                    return;
                }
                
                const randomIndex = Math.floor(Math.random() * validResults.length);
                const item = validResults[randomIndex];
                
                // Get additional details
                const detailsResponse = await fetch(
                    `${BASE_URL}/movie/${item.id}?api_key=${API_KEY}&append_to_response=credits,similar,watch/providers`
                );
                const details = await detailsResponse.json();
                
                // Get watch providers
                const zaProviders = details['watch/providers']?.results?.ZA;
                
                result.innerHTML = `
                    <div class="recommendation-card">
                        <img src="${IMAGE_BASE_URL}${item.poster_path}" 
                             alt="${item.title}"
                             onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'">
                        <div class="recommendation-info">
                            <h3>${item.title}</h3>
                            <div class="recommendation-meta">
                                <span class="recommendation-rating">★ ${item.vote_average.toFixed(1)}</span>
                                <span>${new Date(item.release_date).getFullYear()}</span>
                                <span>${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m</span>
                            </div>
                            <p>${item.overview}</p>
                            <div class="genre-tags">
                                ${details.genres?.map(genre => 
                                    `<span class="genre-tag">${genre.name}</span>`
                                ).join('')}
                            </div>
                            ${details.tagline ? `<p class="tagline">"${details.tagline}"</p>` : ''}
                            ${zaProviders ? `
                                <div class="watch-providers">
                                    <h4>Where to Watch in South Africa:</h4>
                                    ${zaProviders.flatrate ? `
                                        <div class="provider-list">
                                            <p>Stream on: ${zaProviders.flatrate.map(p => p.provider_name).join(', ')}</p>
                                        </div>
                                    ` : ''}
                                    ${zaProviders.rent ? `
                                        <div class="provider-list">
                                            <p>Available to rent on: ${zaProviders.rent.map(p => p.provider_name).join(', ')}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}
                            <div class="cast-list">
                                <h4>Starring:</h4>
                                <p>${details.credits?.cast?.slice(0, 3).map(actor => actor.name).join(', ')}</p>
                            </div>
                            <div class="try-another">
                                <button onclick="getRecommendation()" class="generate-btn">
                                    Try Another
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                result.classList.add('show');
                createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
            } else {
                result.innerHTML = '<p class="error-message">No recommendations found for this genre. Try another one!</p>';
            }
        } catch (error) {
            console.error('Error fetching movie:', error);
            result.innerHTML = '<p class="error-message">Error getting recommendation. Please try again.</p>';
        }
    }
}

// Add click handlers for type toggle
document.addEventListener('DOMContentLoaded', function() {
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            typeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Add these functions for memory handling
function saveMemory() {
    const titleInput = document.getElementById('memory-title');
    const memoryInput = document.getElementById('memory-input');
    const dateInput = document.getElementById('memory-date');
    const photoInput = document.getElementById('memory-photo');
    
    const title = titleInput.value.trim();
    const memoryText = memoryInput.value.trim();
    const memoryDate = dateInput.value;
    
    if (!title || !memoryText || !memoryDate) {
        alert('Please enter a title, memory, and date!');
        return;
    }

    // Handle photo
    const file = photoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveMemoryWithPhoto(title, memoryText, memoryDate, e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        saveMemoryWithPhoto(title, memoryText, memoryDate, null);
    }
}

function saveMemoryWithPhoto(title, memoryText, memoryDate, photoData) {
    // Get existing memories or initialize new array
    let memories = JSON.parse(localStorage.getItem('dateNightMemories') || '[]');
    
    // Add new memory
    memories.push({
        title: title,
        text: memoryText,
        date: memoryDate,
        photo: photoData,
        timestamp: new Date().getTime()
    });
    
    // Save back to localStorage
    localStorage.setItem('dateNightMemories', JSON.stringify(memories));
    
    // Clear inputs
    document.getElementById('memory-title').value = '';
    document.getElementById('memory-input').value = '';
    document.getElementById('memory-date').value = '';
    document.getElementById('memory-photo').value = '';
    document.getElementById('photo-preview').style.display = 'none';
    
    // Refresh display
    displayMemories();
    
    // Show confirmation
    alert('Memory saved successfully! 💝');
}

function displayMemories() {
    const memoriesContainer = document.getElementById('memories-list');
    const memories = JSON.parse(localStorage.getItem('dateNightMemories') || '[]');
    
    if (memories.length === 0) {
        memoriesContainer.innerHTML = '<p class="no-memories">No memories saved yet. Create some magical moments! ✨</p>';
        return;
    }
    
    // Sort memories by date
    memories.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    memoriesContainer.innerHTML = memories.map(memory => `
        <div class="memory-card ${memory.photo ? 'has-photo' : ''}">
            ${memory.photo ? `
                <div class="memory-photo-container">
                    <img src="${memory.photo}" alt="${memory.title}" class="memory-photo">
                </div>
            ` : ''}
            <div class="memory-content">
                <div class="memory-title">${memory.title}</div>
                <div class="memory-date">${new Date(memory.date).toLocaleDateString()}</div>
                <div class="memory-text">${memory.text}</div>
                <button onclick="deleteMemory(${memory.timestamp})" class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add photo preview functionality
document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('memory-photo');
    const photoPreview = document.getElementById('photo-preview');
    
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
});

// Add these back right after the displayMemories function
function deleteMemory(timestamp) {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    
    let memories = JSON.parse(localStorage.getItem('dateNightMemories') || '[]');
    memories = memories.filter(memory => memory.timestamp !== timestamp);
    localStorage.setItem('dateNightMemories', JSON.stringify(memories));
    displayMemories();
}

// Update the DOMContentLoaded event listener to include both photo preview and memory functionality
document.addEventListener('DOMContentLoaded', function() {
    displayMemories();
    
    // Add event listener for save button if it exists
    const saveButton = document.getElementById('save-memory-btn');
    if (saveButton) {
        saveButton.addEventListener('click', saveMemory);
    }
    
    // Photo preview functionality
    const photoInput = document.getElementById('memory-photo');
    const photoPreview = document.getElementById('photo-preview');
    
    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    photoPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Add these functions for the date planner
function generateCalendarLinks(eventData) {
    // Format dates for calendar links
    const startDate = new Date(eventData.start);
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later
    
    // Format dates for Google Calendar
    const googleStart = startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const googleEnd = endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    
    // Create description with both emails
    const description = `
Date Night Plan!
${eventData.description}

Attendees:
- ${eventData.yourEmail}
- ${eventData.partnerEmail}
    `.trim();

    return {
        google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(eventData.location)}&dates=${googleStart}/${googleEnd}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`🗓️ Date Night Plan!\n\n📌 ${eventData.title}\n📅 ${formatDateTime(eventData.start)}\n📍 ${eventData.location}\n\n✨ Activities:\n${eventData.description}\n\nAttendees:\n- ${eventData.yourEmail}\n- ${eventData.partnerEmail}`)}`,
        ics: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${googleStart}
DTEND:${googleEnd}
SUMMARY:${eventData.title}
DESCRIPTION:${description}
LOCATION:${eventData.location}
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '%0A')
    };
}

function showSharingDialog(dateData) {
    const dialog = document.createElement('div');
    dialog.className = 'sharing-dialog';
    dialog.innerHTML = `
        <div class="sharing-content">
            <h3>Date Planned Successfully! 💝</h3>
            <p>Share with your partner:</p>
            <div class="sharing-buttons">
                <a href="${dateData.links.google}" target="_blank" class="share-btn google">
                    <span>Add to Google Calendar</span>
                </a>
                <a href="${dateData.links.ics}" class="share-btn outlook" download="date-night.ics">
                    <span>Download Calendar File (.ics)</span>
                </a>
                <a href="${dateData.links.whatsapp}" target="_blank" class="share-btn whatsapp">
                    <span>Share via WhatsApp</span>
                </a>
                <button onclick="copyCalendarLink('${dateData.links.google}')" class="share-btn copy">
                    <span>Copy Calendar Link</span>
                </button>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="close-btn">Close</button>
        </div>
    `;
    document.body.appendChild(dialog);
}

function sendDateInvite() {
    console.log('Sending date invite...'); // Debug log
    
    const dateTitle = document.getElementById('date-title').value.trim();
    const dateTime = document.getElementById('date-time').value;
    const location = document.getElementById('date-location').value.trim();
    const activities = document.getElementById('date-activities').value.trim();
    const yourEmail = document.getElementById('your-email').value.trim();
    const partnerEmail = document.getElementById('partner-email').value.trim();
    
    if (!dateTitle || !dateTime || !location || !activities) {
        alert('Please fill in all required fields!');
        return;
    }
    
    try {
        // Create date data
        const dateData = {
            title: dateTitle,
            dateTime: dateTime,
            location: location,
            activities: activities,
            yourEmail: yourEmail,
            partnerEmail: partnerEmail,
            id: Date.now()
        };
        
        // Generate sharing links
        const links = generateCalendarLinks({
            title: dateTitle,
            description: activities,
            location: location,
            start: dateTime,
            yourEmail: yourEmail,
            partnerEmail: partnerEmail
        });
        
        // Save links with date data
        dateData.links = links;
        
        // Save to localStorage
        savePlannedDate(dateData);
        
        // Show sharing options dialog
        showSharingDialog(dateData);
        
        clearPlannerForm();
        displayUpcomingDates();
        
    } catch (error) {
        console.error('Error creating date:', error);
        alert('There was an error creating the date. Please try again.');
    }
}

// Make sure these helper functions are present
function formatDateTime(dateTime) {
    return new Date(dateTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
}

function savePlannedDate(dateData) {
    let plannedDates = JSON.parse(localStorage.getItem('plannedDates') || '[]');
    plannedDates.push(dateData);
    localStorage.setItem('plannedDates', JSON.stringify(plannedDates));
}

function clearPlannerForm() {
    document.getElementById('date-title').value = '';
    document.getElementById('date-time').value = '';
    document.getElementById('date-location').value = '';
    document.getElementById('date-activities').value = '';
    document.getElementById('your-email').value = '';
    document.getElementById('partner-email').value = '';
}

function displayUpcomingDates() {
    const container = document.getElementById('upcoming-dates');
    const plannedDates = JSON.parse(localStorage.getItem('plannedDates') || '[]')
        .filter(date => new Date(date.dateTime) > new Date())
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    
    if (plannedDates.length === 0) {
        container.innerHTML = '<p class="no-dates">No upcoming dates planned yet! 🗓️</p>';
        return;
    }
    
    container.innerHTML = plannedDates.map(date => `
        <div class="date-card">
            <h4>${date.title}</h4>
            <div class="date-details">
                <div class="date-detail">
                    <span class="date-detail-icon">🗓️</span>
                    <span>${formatDateTime(date.dateTime)}</span>
                </div>
                <div class="date-detail">
                    <span class="date-detail-icon">📍</span>
                    <span>${date.location}</span>
                </div>
                <div class="date-detail">
                    <span class="date-detail-icon">✨</span>
                    <span>${date.activities}</span>
                </div>
                ${date.partnerEmail ? `
                    <div class="date-detail">
                        <span class="date-detail-icon">📧</span>
                        <span>Partner: ${date.partnerEmail}</span>
                    </div>
                ` : ''}
            </div>
            <div class="date-actions">
                ${date.links ? `
                    <button onclick='showSharingDialog(${JSON.stringify(date).replace(/'/g, "&#39;")})' class="share-again-btn">
                        Share Again 📤
                    </button>
                ` : ''}
                <button onclick="deletePlannedDate(${date.id})" class="delete-btn">
                    Cancel Date
                </button>
            </div>
        </div>
    `).join('');
}

// Add this function to set up event listeners
function setupDatePlanner() {
    const sendInviteBtn = document.getElementById('send-invite');
    if (sendInviteBtn) {
        sendInviteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendDateInvite();
        });
    }
}

// Also add this to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    
    // Set up date planner if we start on that tab
    if (document.querySelector('#date-planner').classList.contains('active')) {
        setupDatePlanner();
    }
});

// Add this helper function that was missing
function copyCalendarLink(link) {
    navigator.clipboard.writeText(link)
        .then(() => alert('Calendar link copied to clipboard! 📋'))
        .catch(err => console.error('Failed to copy link:', err));
}
