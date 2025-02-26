document.addEventListener('DOMContentLoaded', () => {
    // Add background music initialization
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.04;
    
    // Auto-play music on first user interaction with the page
    document.body.addEventListener('click', function initAudio() {
        bgMusic.play();
        document.body.removeEventListener('click', initAudio);
    }, { once: true });

    // Hide loading screen once everything is loaded
    window.addEventListener('load', () => {
        const loadingScreen = document.querySelector('.loading-screen');
        const container = document.querySelector('.container');
        
        loadingScreen.style.animation = 'fadeOut 0.3s ease-in-out forwards';
        container.style.animation = 'fadeIn 0.3s ease-in-out 0.3s forwards';

        // Initialize the map
        const map = L.map('map').setView([41.9028, 12.4964], 2); // Centered on Europe

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Coordinates for Jounieh and Krefeld
        const jounieh = [33.9817, 35.6178];
        const krefeld = [51.3333, 6.5833];

        // Add markers for both locations
        L.marker(jounieh).addTo(map).bindPopup('Jounieh, Lebanon').openPopup();
        L.marker(krefeld).addTo(map).bindPopup('Krefeld, Germany').openPopup();

        // Draw a polyline between the two locations
        const latlngs = [jounieh, krefeld];
        const polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

        // Zoom the map to the polyline
        map.fitBounds(polyline.getBounds());
    });
});

function updateCountdown() {
    const currentDate = new Date();
    const targetDate = new Date(currentDate.getFullYear(), 6, 1); // Month is 0-based, so 6 = July

    // If we've passed July 1st this year, set target to next year
    if (currentDate > targetDate) {
        targetDate.setFullYear(targetDate.getFullYear() + 1);
    }

    const totalSeconds = (targetDate - currentDate) / 1000;

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
// Initial call to avoid delay
updateCountdown();

// Calculate days together
function updateDaysTogether() {
    const startDate = new Date('2025-01-02');
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('days-together').textContent = diffDays;

    // Check milestones
    const milestones = [10, 30, 60, 100, 150, 200, 400];
    milestones.forEach(milestone => {
        if (diffDays >= milestone) {
            const milestoneElement = document.querySelector(`.milestone-item[data-days="${milestone}"]`);
            if (milestoneElement && !milestoneElement.classList.contains('achieved')) {
                milestoneElement.classList.add('achieved');
                milestoneElement.innerHTML += ' 🎉';
                milestoneElement.style.backgroundColor = '#ff4b6e';
                milestoneElement.style.color = 'white';
                milestoneElement.style.fontWeight = 'bold';
            }
        }
    });
}

// Update days together counter
updateDaysTogether();
setInterval(updateDaysTogether, 1000 * 60 * 60); // Update every hour

// Time zone functions
function updateTimes() {
    const yourTime = new Date().toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Beirut',
        hour: '2-digit',
        minute: '2-digit'
    });
    const theirTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('yourTime').textContent = yourTime;
    document.getElementById('theirTime').textContent = theirTime;
}

// Interactive hearts
function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️';
    heart.style.left = x + 'px';
    heart.style.bottom = '0px';
    
    document.getElementById('hearts-container').appendChild(heart);
    
    // Remove heart after animation
    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}

// Click event for creating hearts
document.addEventListener('click', (e) => {
    if (!e.target.closest('.floating-heart')) {
        createHeart(e.clientX);
    }
});

// Distance Calculator
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lat2-lon1); 
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

function updateDistance() {
    // Jounieh coordinates
    const lat1 = 33.9817;
    const lon1 = 35.6178;
    // Krefeld coordinates
    const lat2 = 51.3333;
    const lon2 = 6.5833;
    
    const distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    document.getElementById('distance').textContent = `${Math.round(distance)} km`;
}

// Falling Stars Effect
function createStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.left = `${Math.random() * 100}vw`;
    document.querySelector('.stars-container').appendChild(star);
    
    star.addEventListener('animationend', () => star.remove());
}

// Create stars periodically
setInterval(createStar, 3000);

// Interactive Love Letter
const letterContent = `My dearest,
Every day I think about the moment we'll finally meet.
You make my heart skip a beat with every message.
I can't wait to hold your hand and see your smile in person.
Until then, I'm counting every second...
With all my love ❤️`;

function startReveal() {
    const messageElement = document.getElementById('special-message');
    const button = document.getElementById('revealButton');
    button.style.display = 'none';
    messageElement.textContent = '';
    revealMessage(letterContent);
}

function revealMessage(message) {
    const messageElement = document.getElementById('special-message');
    let i = 0;
    const interval = setInterval(() => {
        if (i < message.length) {
            messageElement.textContent += message[i];
            i++;
        } else {
            clearInterval(interval);
        }
    }, 50);
}

// Floating Messages
function createFloatingMessage() {
    // ... entire function
}

// Initialize everything
function init() {
    // Update time every second
    updateTimes();
    setInterval(updateTimes, 1000);
    
    // Update distance
    updateDistance();

    // Music controls
    const bgMusic = document.getElementById('bgMusic');
    const toggleButton = document.getElementById('toggleMusic');
    const volumeSlider = document.getElementById('volumeSlider');

    toggleButton.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            toggleButton.textContent = '🔊';
        } else {
            bgMusic.pause();
            toggleButton.textContent = '🔇';
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
    });

    // Add floating hearts animation
    function createFloatingHearts() {
        const colors = ['#ff758c', '#ff8fa3', '#ffb3c1'];
        const heart = document.createElement('div');
        heart.className = 'floating-heart-bg';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.background = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(heart);
        
        heart.addEventListener('animationend', () => heart.remove());
    }
    
    setInterval(createFloatingHearts, 2000);

    // Initialize garden
    initGarden();
}

init();

// Custom Cursor
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.innerHTML = '❤️';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Interactive Background
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    document.body.style.backgroundImage = 
        `linear-gradient(${x * 360}deg, #ff758c ${y * 100}%, #ff7eb3)`;
});

// Fireworks
function createFirework(x, y) {
    const colors = ['#ff0', '#f0f', '#0ff', '#ff4b6e', '#fff'];
    for(let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 2 + Math.random() * 2;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { 
                transform: `translate(${Math.cos(angle) * 100 * velocity}px, 
                            ${Math.sin(angle) * 100 * velocity}px) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0,0,0.2,1)'
        });
        
        animation.onfinish = () => particle.remove();
    }
}

// Create fireworks on click
document.addEventListener('click', (e) => {
    createFirework(e.clientX, e.clientY);
});

// Add this new function
function initGarden() {
    const gardenPlot = document.querySelector('.garden-plot');
    const milestones = [
        { days: 10, flower: '🌺', description: '10 Days Together' },
        { days: 30, flower: '🌷', description: '30 Days Together' },
        { days: 60, flower: '🌸', description: '60 Days Together' },
        { days: 100, flower: '🌹', description: '100 Days Together' },
        { days: 150, flower: '🌻', description: '150 Days Together' },
        { days: 200, flower: '🌼', description: '200 Days Together' },
        { days: 400, flower: '🌺', description: '400 Days Together' }
    ];

    // Clear existing flowers
    gardenPlot.innerHTML = '';

    function addFlower(milestone, achieved) {
        const flowerElement = document.createElement('div');
        flowerElement.className = 'flower-item' + (achieved ? ' achieved' : ' upcoming');
        
        if (achieved) {
            flowerElement.textContent = milestone.flower;
            flowerElement.style.animation = `swayFlower ${2 + Math.random()}s ease-in-out infinite`;
            flowerElement.style.animationDelay = `${Math.random()}s`;
        } else {
            flowerElement.textContent = '🌱';
        }
        
        const tooltip = document.createElement('div');
        tooltip.className = 'flower-tooltip';
        tooltip.textContent = achieved ? 
            milestone.description + ' ✨' : 
            `Growing... (${milestone.description})`;
        
        flowerElement.appendChild(tooltip);
        gardenPlot.appendChild(flowerElement);
    }

    // Check which milestones are achieved by looking at the milestone list
    const achievedMilestones = new Set();
    document.querySelectorAll('.milestone-item').forEach(item => {
        if (item.classList.contains('achieved')) {
            achievedMilestones.add(parseInt(item.dataset.days));
        }
    });

    // Sort milestones by days
    milestones.sort((a, b) => a.days - b.days);

    // Add flowers based on achieved milestones
    milestones.forEach(milestone => {
        addFlower(milestone, achievedMilestones.has(milestone.days));
    });

    // Add interactive effects
    gardenPlot.addEventListener('mousemove', (e) => {
        const flowers = document.querySelectorAll('.flower-item.achieved');
        flowers.forEach(flower => {
            const rect = flower.getBoundingClientRect();
            const x = (rect.left + rect.right) / 2;
            const y = (rect.top + rect.bottom) / 2;
            const distanceX = e.clientX - x;
            const distanceY = e.clientY - y;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const angle = Math.atan2(distanceY, distanceX);
                const push = (1 - distance / maxDistance) * 5;
                flower.style.transform = `translate(${Math.cos(angle) * push}px, ${Math.sin(angle) * push}px)`;
            } else {
                flower.style.transform = '';
            }
        });
    });
}

// Add this function to handle the startup animation sequence
function startupAnimation() {
    const sequence = [
        {
            elements: ['.left-container'],
            animation: 'animate-slide-left',
            delay: 300
        },
        {
            elements: ['.right-container'],
            animation: 'animate-slide-right',
            delay: 300
        },
        {
            elements: ['h1'],
            animation: 'animate-pop',
            delay: 600
        },
        {
            elements: ['.love-letter', '.stats', '.countdown'],
            animation: 'animate-fade-up',
            delay: 900
        },
        {
            elements: ['.garden-container'],
            animation: 'animate-fade-up',
            delay: 1200
        },
        {
            elements: ['.music-controls'],
            animation: 'animate-pop',
            delay: 1500
        }
    ];

    sequence.forEach(item => {
        setTimeout(() => {
            item.elements.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.style.opacity = '1';
                    element.classList.add(item.animation);
                });
            });
        }, item.delay);
    });
}

// Modify the existing load event handler
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const container = document.querySelector('.container');
    
    loadingScreen.style.animation = 'fadeOut 0.3s ease-in-out forwards';
    
    // Start the animation sequence after loading screen fades out
    setTimeout(() => {
        startupAnimation();
        
        // Initialize the map after animations
        const map = L.map('map').setView([41.9028, 12.4964], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const jounieh = [33.9817, 35.6178];
        const krefeld = [51.3333, 6.5833];

        L.marker(jounieh).addTo(map).bindPopup('Jounieh, Lebanon').openPopup();
        L.marker(krefeld).addTo(map).bindPopup('Krefeld, Germany').openPopup();

        const latlngs = [jounieh, krefeld];
        const polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
        map.fitBounds(polyline.getBounds());
    }, 300); // Start after loading screen fade out
});