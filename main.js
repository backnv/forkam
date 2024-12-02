// Main JavaScript for tab switching
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeButton(savedTheme);
    }

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        let newTheme;
        
        // Cycle through themes: light -> dark -> gray -> light
        switch(currentTheme) {
            case 'light':
                newTheme = 'dark';
                break;
            case 'dark':
                newTheme = 'gray';
                break;
            default:
                newTheme = 'light';
        }
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });

    function updateThemeButton(theme) {
        const button = document.getElementById('themeToggle');
        switch(theme) {
            case 'dark':
                button.textContent = '🌙 Dark Mode';
                break;
            case 'gray':
                button.textContent = '⚫ Gray Mode';
                break;
            default:
                button.textContent = '☀️ Light Mode';
        }
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
