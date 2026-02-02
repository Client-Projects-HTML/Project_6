document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const html = document.documentElement;

    // Check localStorage or System
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        });
    });

    // Mobile Menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        function toggleMenu() {
            const isRTL = html.getAttribute('dir') === 'rtl';
            if (isRTL) {
                mobileMenu.classList.toggle('rtl:translate-x-full');
                mobileMenu.classList.toggle('-translate-x-full');
            } else {
                mobileMenu.classList.toggle('-translate-x-full');
            }
            menuOverlay.classList.toggle('hidden');
        }

        menuBtn.addEventListener('click', toggleMenu);
        if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);
    }

    // Seasonal Toggle (Summer/Winter)
    const seasonalToggle = document.getElementById('seasonal-toggle');
    const seasonalContent = document.querySelectorAll('[data-season]');

    // Default to Summer
    let currentSeason = localStorage.getItem('season') || 'summer';
    applySeason(currentSeason);

    if (seasonalToggle) {
        seasonalToggle.addEventListener('click', () => {
            currentSeason = currentSeason === 'summer' ? 'winter' : 'summer';
            applySeason(currentSeason);
            localStorage.setItem('season', currentSeason);
        });
    }

    // Mobile Seasonal Toggle
    const mobileSeasonalToggle = document.getElementById('mobile-seasonal-toggle');
    if (mobileSeasonalToggle) {
        mobileSeasonalToggle.addEventListener('click', () => {
            currentSeason = currentSeason === 'summer' ? 'winter' : 'summer';
            applySeason(currentSeason);
            localStorage.setItem('season', currentSeason);
        });
    }

    function applySeason(season) {
        // Update UI logic here if specific elements need changing
        // Example: Changing hero text or showing/hiding elements
        seasonalContent.forEach(el => {
            if (el.dataset.season === season || el.dataset.season === 'both') {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });

        // Update Toggle Icon/Text if exists
        const seasonIcon = document.getElementById('season-icon');
        const seasonLabel = document.getElementById('season-label');

        if (seasonIcon) {
            seasonIcon.className = season === 'summer' ? 'ph-bold ph-sun text-yellow-500' : 'ph-bold ph-snowflake text-blue-500';
        }
        if (seasonLabel) {
            seasonLabel.textContent = season === 'summer' ? 'Summer Mode' : 'Winter Mode';
        }

        // Update Mobile Toggle Icon
        const mobileSeasonBtn = document.getElementById('mobile-seasonal-toggle');
        if (mobileSeasonBtn) {
            const mobileIcon = mobileSeasonBtn.querySelector('i');
            if (mobileIcon) {
                mobileIcon.className = season === 'summer'
                    ? 'ph-bold ph-sun text-xl text-yellow-500'
                    : 'ph-bold ph-snowflake text-xl text-blue-500';
            }
        }

        // Optional: Add global class for styling hooks
        if (season === 'winter') {
            document.body.classList.add('theme-winter');
            document.body.classList.remove('theme-summer');
        } else {
            document.body.classList.add('theme-summer');
            document.body.classList.remove('theme-winter');
        }
    }
});

function toggleRTL() {
    const html = document.documentElement;
    if (html.getAttribute('dir') === 'rtl') {
        html.setAttribute('dir', 'ltr');
        localStorage.setItem('dir', 'ltr');
    } else {
        html.setAttribute('dir', 'rtl');
        localStorage.setItem('dir', 'rtl');
    }
}

// Init RTL
if (localStorage.getItem('dir') === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
}
