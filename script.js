document.addEventListener('DOMContentLoaded', () => {
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
});