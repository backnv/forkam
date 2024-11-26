// Tab 3 specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const colorBoxes = document.querySelectorAll('.color-box');

    colorBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            this.style.backgroundColor = randomColor;
        });

        // Initial random colors
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        box.style.backgroundColor = randomColor;
    });
});
