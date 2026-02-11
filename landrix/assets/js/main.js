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

document.addEventListener('DOMContentLoaded', () => {
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

    // Global Confirm Dialog System
    const dialogStyles = `
    <style>
        @keyframes dialog-zoom {
            from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .dialog-animate {
            animation: dialog-zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .modal-overlay {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', dialogStyles);

    const dialogHTML = `
    <div id="global-dialog" class="fixed inset-0 z-[100] hidden">
        <div class="absolute inset-0 bg-slate-900/60 transition-opacity modal-overlay"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4 dialog-animate">
            <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div class="p-8 text-center">
                    <div id="dialog-icon-container" class="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center mx-auto mb-6 text-4xl">
                        <i id="dialog-icon" class="ph-bold ph-question"></i>
                    </div>
                    <h3 id="dialog-title" class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Confirm Action</h3>
                    <p id="dialog-message" class="text-slate-500 dark:text-slate-400">Are you sure you want to proceed with this action?</p>
                </div>
                <div class="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                    <button id="dialog-cancel" class="flex-1 px-6 py-3.5 rounded-2xl text-slate-600 dark:text-slate-400 font-bold hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all focus:outline-none">Cancel</button>
                    <button id="dialog-confirm" class="flex-1 px-6 py-3.5 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/25 transition-all focus:outline-none">Confirm</button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', dialogHTML);

    const dialog = document.getElementById('global-dialog');
    const dTitle = document.getElementById('dialog-title');
    const dMessage = document.getElementById('dialog-message');
    const dIcon = document.getElementById('dialog-icon');
    const dIconContainer = document.getElementById('dialog-icon-container');
    const dConfirm = document.getElementById('dialog-confirm');
    const dCancel = document.getElementById('dialog-cancel');

    window.showConfirmDialog = function ({
        title = 'Confirm',
        message = 'Are you sure?',
        icon = 'ph-question',
        theme = 'primary',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        showCancel = true,
        onConfirm
    }) {
        dTitle.textContent = title;
        dMessage.textContent = message;
        dIcon.className = `ph-bold ${icon}`;
        dConfirm.innerText = confirmText;
        dCancel.innerText = cancelText;

        // Reset theme classes
        dIconContainer.className = `w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl `;
        dConfirm.className = `flex-1 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg `;

        if (showCancel) {
            dCancel.classList.remove('hidden');
        } else {
            dCancel.classList.add('hidden');
        }

        if (theme === 'danger') {
            dIconContainer.classList.add('bg-red-50', 'dark:bg-red-900/20', 'text-red-500');
            dConfirm.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white', 'shadow-red-500/25');
        } else if (theme === 'success') {
            dIconContainer.classList.add('bg-green-50', 'dark:bg-green-900/20', 'text-green-500');
            dConfirm.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white', 'shadow-green-500/25');
        } else {
            dIconContainer.classList.add('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary-500');
            dConfirm.classList.add('bg-primary-500', 'hover:bg-primary-600', 'text-white', 'shadow-primary-500/25');
        }

        dialog.classList.remove('hidden');

        // Handlers
        const handleConfirm = () => {
            dialog.classList.add('hidden');
            if (onConfirm) onConfirm();
            cleanup();
        };

        const handleCancel = () => {
            dialog.classList.add('hidden');
            cleanup();
        };

        const cleanup = () => {
            dConfirm.removeEventListener('click', handleConfirm);
            dCancel.removeEventListener('click', handleCancel);
        };

        dConfirm.addEventListener('click', handleConfirm);
        dCancel.addEventListener('click', handleCancel);
    };

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
