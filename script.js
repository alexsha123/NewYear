/* =========================================
   1. SMART PHOTO GALLERY LOADER
   ========================================= */
const galleryContainer = document.getElementById('gallery-loader');

// CONFIG: How many photos to check for? (It will hide missing ones automatically)
const maxPhotosToCheck = 50; 

// CONFIG: Add special captions for specific photo numbers here
const captions = {
  
};

if (galleryContainer) {
    for (let i = 1; i <= maxPhotosToCheck; i++) {
        // Create the container div
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        // Random slight rotation for "messy polaroid" look
        const rotate = Math.random() * 6 - 3; 

        // Check if there is a caption for this number
        const captionHTML = captions[i] ? `<p class="handwriting">${captions[i]}</p>` : '';

        // The HTML structure
        // 'onerror' is the magic: if picX.jpg doesn't exist, it removes the box.
        item.innerHTML = `
            <div class="polaroid-frame" style="transform: rotate(${rotate}deg);">
                <img src="Photos/pic${i}.jpg" 
                     alt="Memory ${i}" 
                     loading="lazy"
                     onerror="this.closest('.gallery-item').remove()"> 
                ${captionHTML}
            </div>
        `;
        
        galleryContainer.appendChild(item);
    }
}

/* =========================================
   2. SCROLL ANIMATIONS
   ========================================= */
// This makes elements fade in when you scroll down
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.add('active'); // For compatibility with older css
        }
    });
}, { threshold: 0.1 });

// Wait a split second for the gallery to build, then observe
setTimeout(() => {
    document.querySelectorAll('.gallery-item, .scroll-reveal').forEach(el => observer.observe(el));
}, 200);


/* =========================================
   3. COUNTDOWN TIMER (Target: Jan 1, 2026)
   ========================================= */
function updateCountdown() {
    const nextYear = new Date("Jan 1, 2026 00:00:00").getTime();
    const now = new Date().getTime();
    const diff = nextYear - now;

    const countdownEl = document.getElementById('countdown');
    const titleEl = document.querySelector('.glitter-text');

    if (countdownEl) {
        if (diff <= 0) {
            // --- IT IS MIDNIGHT! ---
            countdownEl.innerHTML = "<div class='new-year-toast'>IT'S OUR YEAR! 🥂</div>";
            if(titleEl) titleEl.innerText = "HAPPY 2026!";
            
            // Trigger Confetti
            launchConfetti();
        } else {
            // Update the numbers
            document.getElementById('hours').innerText = Math.floor(diff / (1000 * 60 * 60));
            document.getElementById('mins').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('secs').innerText = Math.floor((diff % (1000 * 60)) / 1000);
        }
    }
}
// Run the countdown every second
setInterval(updateCountdown, 1000);


/* =========================================
   4. CONFETTI EFFECT
   ========================================= */
function launchConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 50 * (timeLeft / duration);
        
        // Safety check if library is loaded
        if(typeof confetti === 'function') {
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
        }
    }, 250);
}


/* =========================================
   5. INTERACTIVE BUTTONS
   ========================================= */
// For the Message Page Resolution Reveal
function revealResolution() {
    const btn = document.getElementById('reveal-btn');
    const text = document.getElementById('resolution-text');
    if(btn && text) {
        btn.style.display = 'none';
        text.style.display = 'block';
        launchConfetti(); // Celebration pop!
    }
}


/* =========================================
   6. BACKGROUND EFFECTS (Stars & Hearts)
   ========================================= */
// Generate Stars (Index/Message Page)
const stars = document.getElementById('stars');
if (stars) {
    for (let i = 0; i < 60; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute; 
            width: 2px; height: 2px; 
            background: white; 
            top: ${Math.random() * 100}%; 
            left: ${Math.random() * 100}%; 
            opacity: ${Math.random()};
        `;
        stars.appendChild(star);
    }
}

// Generate Floating Hearts (Memories Page)
const heartContainer = document.getElementById('heart-container');
if (heartContainer) {
    const symbols = ['❤️', '✨', '🌸', '💕'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 5 + 6) + 's'; 
        heart.style.animationDelay = Math.random() * 5 + 's';
        heartContainer.appendChild(heart);
    }
}
/* =========================================
   7. MUSIC PLAYER LOGIC
   ========================================= */
const audio = document.getElementById('bg-audio');
const musicIcon = document.getElementById('music-icon');
const musicBtn = document.querySelector('.music-control');

function toggleAudio() {
    if (audio.paused) {
        audio.play();
        musicIcon.innerText = "⏸️"; // Change to Pause Icon
        musicBtn.classList.add('music-playing');
    } else {
        audio.pause();
        musicIcon.innerText = "🎵"; // Change back to Music Note
        musicBtn.classList.remove('music-playing');
    }
}

// AUTOPLAY HACK: Try to play music on the very first click anywhere on the page
// (Browsers allow audio after the first user interaction)
document.body.addEventListener('click', function() {
    if (audio.paused) {
        audio.play();
        musicIcon.innerText = "⏸️";
        musicBtn.classList.add('music-playing');
    }
}, { once: true }); // This ensures it only runs once
