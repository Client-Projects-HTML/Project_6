// Dashboard Sidebar Toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

if (sidebarToggle && sidebar && sidebarOverlay) {
    sidebarToggle.addEventListener('click', () => {
        const isRTL = document.documentElement.dir === 'rtl';
        if (isRTL) {
            sidebar.classList.toggle('rtl:translate-x-full');
            sidebar.classList.toggle('-translate-x-full');
        } else {
            sidebar.classList.toggle('-translate-x-full');
        }
        sidebarOverlay.classList.toggle('hidden');
    });

    sidebarOverlay.addEventListener('click', () => {
        const isRTL = document.documentElement.dir === 'rtl';
        if (isRTL) {
            sidebar.classList.add('rtl:translate-x-full');
            sidebar.classList.add('-translate-x-full');
        } else {
            sidebar.classList.add('-translate-x-full');
        }
        sidebarOverlay.classList.add('hidden');
    });
}

// Re-use Global Toggles (Dark Mode, RTL) if they exist in the dashboard header
// These are likely handled by main.js if included, or we can duplicate essential logic here.
// Assuming main.js is NOT included in dashboard to keep it lightweight, or if it is, this file handles dashboard-specifics.

// Initialize specific dashboard charts or interactive elements would go here.
console.log('Dashboard JS Loaded');
