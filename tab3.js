function updateCurrentTime() {
    const now = new Date();
    const formattedTime = now.toLocaleString();
    document.getElementById('currentTime').textContent = `Текущее время: ${formattedTime}`;
}

function saveLink() {
    const linkInput = document.getElementById('linkInput');
    const link = linkInput.value.trim();
    if (link === '') return;

    const now = new Date();
    const timestamp = now.getTime();
    const formattedTime = now.toLocaleString();

    const linkData = {
        link: link,
        timestamp: timestamp,
        formattedTime: formattedTime,
        status: false // Initial status is not "В работе"
    };

    let links = JSON.parse(localStorage.getItem('links')) || [];
    links.push(linkData);
    localStorage.setItem('links', JSON.stringify(links));

    linkInput.value = '';
    displayLinks();
}

function displayLinks() {
    const linkList = document.getElementById('linkList');
    linkList.innerHTML = '';

    const links = JSON.parse(localStorage.getItem('links')) || [];
    const now = new Date();

    links.forEach((linkData, index) => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';

        const elapsedTime = now.getTime() - linkData.timestamp;
        const hoursElapsed = elapsedTime / (1000 * 60 * 60);

        if (hoursElapsed > 1) {
            linkItem.className += ' expired';
        }

        const shortLink = linkData.link.length > 30 ? linkData.link.substring(0, 30) + '...' : linkData.link;

        linkItem.innerHTML = `
            <input type="checkbox" class="status-checkbox" ${linkData.status ? 'checked' : ''} onchange="toggleStatus(${index})">
            <a href="#" onclick="copyLink('${linkData.link}')">${shortLink}</a>
            <span>${linkData.formattedTime}</span>
            <button class="delete-button" onclick="deleteLink(${index})">Удалить</button>
        `;

        linkList.appendChild(linkItem);
    });
}

function toggleStatus(index) {
    let links = JSON.parse(localStorage.getItem('links')) || [];
    links[index].status = !links[index].status;
    localStorage.setItem('links', JSON.stringify(links));
    displayLinks();
}

function deleteLink(index) {
    let links = JSON.parse(localStorage.getItem('links')) || [];
    links.splice(index, 1);
    localStorage.setItem('links', JSON.stringify(links));
    displayLinks();
}

function copyLink(link) {
    navigator.clipboard.writeText(link)
        .then(() => {
            showToast();
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

function showToast() {
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = 'Ссылка скопирована в буфер обмена!';
    toastMessage.classList.add('show');

    setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 1500);
}




document.addEventListener('DOMContentLoaded', (event) => {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    displayLinks();
});
