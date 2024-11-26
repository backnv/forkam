// Main JavaScript for tab switching
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeButton(savedTheme === 'dark');
    }

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme === 'dark');
    });

    function updateThemeButton(isDark) {
        themeToggle.innerHTML = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }

    // Menu Toggle Functionality
    const menuItems = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');

    function switchTab(tabId) {
        // Remove active class from all tabs and contents
        menuItems.forEach(item => item.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);
        
        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');
        }
    }

    // Add click event listeners to menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Toggle side menu
    menuToggle.addEventListener('click', function() {
        sideMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target) && sideMenu.classList.contains('active')) {
            sideMenu.classList.remove('active');
        }
    });
});
