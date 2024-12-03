document.addEventListener('DOMContentLoaded', () => {

    const themeSwitcher = document.getElementById('theme-switcher');
    let currentThemeIndex = 0;
    const themes = ['default-theme', 'light-theme', 'dark-theme', 'coffe-theme'];
    const themeNames = ['Default Theme', 'Light Theme', 'Dark Theme', 'Coffe Theme'];

    // Load the saved theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.documentElement.className = savedTheme;
        currentThemeIndex = themes.indexOf(savedTheme);
        themeSwitcher.textContent = themeNames[currentThemeIndex];
    } else {
        themeSwitcher.textContent = themeNames[currentThemeIndex];
    }

    themeSwitcher.addEventListener('click', function() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const selectedTheme = themes[currentThemeIndex];
        document.documentElement.className = selectedTheme;
        themeSwitcher.textContent = themeNames[currentThemeIndex];

        // Save the selected theme to localStorage
        localStorage.setItem('selectedTheme', selectedTheme);
    });
    
    const menuItems = document.querySelectorAll('.menu-item');
    const backButtons = document.querySelectorAll('.menu-back');
    const postsContainer = document.querySelector('.posts-container');

    // Show specific post
    function showPost(postId) {
        // Hide only other posts
        document.querySelectorAll('.post').forEach(post => {
            if (post.id === postId) {
                post.classList.add('visible');
            } else {
                post.classList.remove('visible');
            }
        });
        postsContainer.classList.add('visible');
    }

    // Handle menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const postId = item.getAttribute('data-post');
            
            if (targetId) {
                // Navigate to submenu
                const currentMenu = item.closest('.menu-level');
                const targetMenu = document.getElementById(targetId);
                
                if (currentMenu && targetMenu) {
                    currentMenu.classList.remove('active');
                    targetMenu.classList.add('active');
                }
            }
            
            if (postId) {
                // Show post content
                showPost(postId);
            }
        });
    });

    // Handle back button clicks
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            if (targetId) {
                const currentMenu = button.closest('.menu-level');
                const targetMenu = document.getElementById(targetId);
                
                if (currentMenu && targetMenu) {
                    currentMenu.classList.remove('active');
                    targetMenu.classList.add('active');
                }
            }
        });
    });
























  // Функция для открытия попапа
    function openPopup(imageSrc) {
        // Создаем попап
        const popup = document.createElement('div');
        popup.classList.add('popup');

        // Создаем контейнер для изображения
        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');

        // Создаем изображение
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = 'Image Popup';

        // Добавляем изображение в контейнер
        popupContent.appendChild(img);

        // Добавляем контейнер в попап
        popup.appendChild(popupContent);

        // Добавляем попап в body
        document.body.appendChild(popup);

        // Закрытие попапа при клике
        popup.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        // Обработчик события движения мыши
        popup.addEventListener('mousemove', (event) => {
            const popupRect = popup.getBoundingClientRect();
            const contentRect = popupContent.getBoundingClientRect();

            // Вычисляем смещение мыши относительно центра попапа
            const mouseX = event.clientX - popupRect.left;

            // Проверяем, умещается ли изображение внутри попапа
            if (contentRect.width <= popupRect.width) {
                popupContent.style.transform = 'translateX(0)';
                return;
            }

            // Вычисляем смещение контента с дополнительными 50 пикселями
            const offsetX = (mouseX / popupRect.width - 0.5) * (contentRect.width - popupRect.width + 100);

            // Применяем смещение к контенту
            popupContent.style.transform = `translateX(${-offsetX}px)`;
        });
    }

    // Обработчик события клика на изображениях
    document.querySelectorAll('.post img').forEach(img => {
        img.addEventListener('click', () => {
            openPopup(img.src);
        });
    });









    document.querySelectorAll('.tab-container').forEach(container => {
            const tabs = container.querySelectorAll('.tab');
            const contents = container.querySelectorAll('.tab-content');

            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs and tab contents in the current container
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));

                    // Add active class to the clicked tab and its corresponding content
                    tab.classList.add('active');
                    contents[index].classList.add('active');
                });
            });
        });




});