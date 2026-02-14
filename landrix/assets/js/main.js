// Theme Toggle Logic
function initTheme() {
    const html = document.documentElement;
    const theme = localStorage.getItem('theme');

    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
}

// Initial check (before DOMContentLoaded if possible, but JS is at bottom usually)
initTheme();

function ensureFavicon() {
    const faviconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="64" fill="#10b981"/><g transform="translate(32, 40) scale(0.75)"><path d="M128,192 C128,152 168,120 216,120 C264,120 264,192 128,192 Z" fill="none" stroke="white" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><path d="M128,192 C128,152 88,136 40,136 C-8,136 -8,208 128,200" fill="none" stroke="white" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><path d="M128,248 L128,192" fill="none" stroke="white" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';
    const faviconHref = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

    const iconLinks = document.querySelectorAll('link[rel~="icon"]');
    if (iconLinks.length) {
        iconLinks.forEach(link => {
            link.href = faviconHref;
            link.type = 'image/svg+xml';
        });
        return;
    }

    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.type = 'image/svg+xml';
    icon.href = faviconHref;
    document.head.appendChild(icon);
}

document.addEventListener('DOMContentLoaded', () => {
    ensureFavicon();

    // Re-check theme on load
    initTheme();

    const themeToggles = document.querySelectorAll('.theme-toggle');
    const html = document.documentElement;

    // Keep theme toggle visually distinct from seasonal toggle:
    // use "circle-half" icon for dark-state theme button instead of another sun.
    document.querySelectorAll('.theme-toggle .ph-sun').forEach(icon => {
        icon.classList.remove('ph-sun');
        icon.classList.add('ph-circle-half');
    });

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            window.dispatchEvent(new Event('themeChanged'));

            // Proactively update other theme toggles on same page
            document.querySelectorAll('.theme-toggle').forEach(t => {
                // Icons update via tailwind dark: classes automatically
            });
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

    // Seasonal Toggle Logic
    const seasonalContent = document.querySelectorAll('[data-season]');

    // Default to Summer
    let currentSeason = localStorage.getItem('season') || 'summer';

    // Global function to set season (callable from HTML)
    window.setSeason = function (season) {
        currentSeason = season;
        localStorage.setItem('season', season);
        applySeason(season);

        // Close dropdowns after selection
        const desktopMenu = document.getElementById('seasonal-dropdown-menu');
        const desktopArrow = document.getElementById('seasonal-arrow');
        if (desktopMenu) {
            desktopMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
            if (desktopArrow) desktopArrow.classList.remove('rotate-180');
        }

        const mobileMenu = document.getElementById('mobile-seasonal-dropdown-menu');
        const mobileArrow = document.getElementById('mobile-seasonal-arrow');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            if (mobileArrow) mobileArrow.classList.remove('rotate-180');
        }
    };

    function applySeason(season) {
        seasonalContent.forEach(el => {
            if (el.dataset.season === season || el.dataset.season === 'both') {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });

        // Update Desktop Toggle UI
        const seasonLabelMain = document.getElementById('season-label-main');

        if (seasonLabelMain) {
            seasonLabelMain.textContent = season === 'summer' ? 'Summer Mode' : 'Winter Mode';
        }

        // Update Mobile Toggle UI
        const mobileSeasonLabelMain = document.getElementById('mobile-season-label-main');

        if (mobileSeasonLabelMain) {
            mobileSeasonLabelMain.textContent = season === 'summer' ? 'Summer Mode' : 'Winter Mode';
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

    // Initial Apply
    applySeason(currentSeason);

    // Dropdown Toggles Initialization
    function initSeasonalDropdown() {
        const desktopToggle = document.getElementById('seasonal-dropdown-toggle');
        const desktopMenu = document.getElementById('seasonal-dropdown-menu');
        const desktopArrow = document.getElementById('seasonal-arrow');

        const mobileToggle = document.getElementById('mobile-seasonal-dropdown-toggle');
        const mobileMenu = document.getElementById('mobile-seasonal-dropdown-menu');
        const mobileArrow = document.getElementById('mobile-seasonal-arrow');

        if (desktopToggle && desktopMenu) {
            desktopToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = !desktopMenu.classList.contains('invisible');

                if (isOpen) {
                    desktopMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
                    if (desktopArrow) desktopArrow.classList.remove('rotate-180');
                } else {
                    desktopMenu.classList.remove('opacity-0', 'invisible', 'translate-y-2');
                    if (desktopArrow) desktopArrow.classList.add('rotate-180');
                }
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!desktopToggle.contains(e.target) && !desktopMenu.contains(e.target)) {
                    desktopMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
                    if (desktopArrow) desktopArrow.classList.remove('rotate-180');
                }
            });
        }

        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = mobileMenu.classList.contains('hidden');

                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    if (mobileArrow) mobileArrow.classList.add('rotate-180');
                } else {
                    mobileMenu.classList.add('hidden');
                    if (mobileArrow) mobileArrow.classList.remove('rotate-180');
                }
            });
        }
    }

    initSeasonalDropdown();

    // Login Dropdown Logic
    function initLoginDropdown() {
        const desktopToggle = document.getElementById('login-dropdown-toggle');
        const desktopMenu = document.getElementById('login-dropdown-menu');
        const desktopArrow = document.getElementById('login-arrow');

        const mobileToggle = document.getElementById('mobile-login-dropdown-toggle');
        const mobileMenu = document.getElementById('mobile-login-dropdown-menu');
        const mobileArrow = document.getElementById('mobile-login-arrow');

        if (desktopToggle && desktopMenu) {
            desktopToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = !desktopMenu.classList.contains('invisible');

                if (isOpen) {
                    desktopMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
                    desktopArrow.classList.remove('rotate-180');
                } else {
                    desktopMenu.classList.remove('opacity-0', 'invisible', 'translate-y-2');
                    desktopArrow.classList.add('rotate-180');
                }
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!desktopToggle.contains(e.target) && !desktopMenu.contains(e.target)) {
                    desktopMenu.classList.add('opacity-0', 'invisible', 'translate-y-2');
                    desktopArrow.classList.remove('rotate-180');
                }
            });
        }

        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = mobileMenu.classList.contains('hidden');

                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    mobileArrow.classList.add('rotate-180');
                } else {
                    mobileMenu.classList.add('hidden');
                    mobileArrow.classList.remove('rotate-180');
                }
            });
        }
    }

    initLoginDropdown();
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
