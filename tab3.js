// Функция для установки времени активации
function setActivationTime(minutes) {
    document.getElementById('activationTimeInput').value = minutes;
}

// Функция для обновления текущего времени на странице
function updateCurrentTime() {
    const now = new Date(); // Получаем текущую дату и время
    const formattedTime = now.toLocaleString(); // Форматируем время в строку
    document.getElementById('currentTime').textContent = `Текущее время: ${formattedTime}`; // Обновляем содержимое элемента с текущим временем
}

// Функция для сохранения ссылки
function saveLink() {
    const linkInput = document.getElementById('linkInput'); // Получаем элемент ввода ссылки
    const link = linkInput.value.trim(); // Получаем значение ссылки и удаляем пробелы по краям
    if (link === '') return; // Если ссылка пустая, выходим из функции

    const activationTimeInput = document.getElementById('activationTimeInput'); // Получаем элемент ввода времени активации
    const activationTime = parseInt(activationTimeInput.value.trim(), 10); // Получаем значение времени активации и преобразуем в число

    const now = new Date(); // Получаем текущую дату и время
    const timestamp = now.getTime(); // Получаем текущее время в миллисекундах
    const formattedTime = now.toLocaleString(); // Форматируем время в строку

    // Создаем объект с данными ссылки
    const linkData = {
        link: link,
        timestamp: timestamp,
        formattedTime: formattedTime,
        status: false, // Начальный статус не "В работе"
        activationTime: activationTime // Время, через которое ссылка станет активной
    };

    let links = JSON.parse(localStorage.getItem('links')) || []; // Получаем сохраненные ссылки из localStorage или создаем пустой массив
    links.push(linkData); // Добавляем новую ссылку в массив
    localStorage.setItem('links', JSON.stringify(links)); // Сохраняем обновленный массив ссылок в localStorage

    linkInput.value = ''; // Очищаем поле ввода ссылки
    activationTimeInput.value = ''; // Очищаем поле ввода времени активации
    displayLinks(); // Обновляем отображение списка ссылок
    updateActiveCount(); // Обновляем количество активных элементов
}

// Функция для отображения списка ссылок
function displayLinks() {
    const linkList = document.getElementById('linkList'); // Получаем элемент списка ссылок
    linkList.innerHTML = ''; // Очищаем содержимое списка

    const links = JSON.parse(localStorage.getItem('links')) || []; // Получаем сохраненные ссылки из localStorage или создаем пустой массив
    const now = new Date(); // Получаем текущую дату и время

    links.forEach((linkData, index) => { // Перебираем все ссылки
        const linkItem = document.createElement('div'); // Создаем элемент для ссылки
        linkItem.className = 'link-item'; // Устанавливаем класс для элемента ссылки

        const elapsedTime = now.getTime() - linkData.timestamp; // Вычисляем прошедшее время с момента добавления ссылки
        const minutesElapsed = elapsedTime / (1000 * 60); // Переводим прошедшее время в минуты

        // Проверяем, истекло ли время активации ссылки
        if (minutesElapsed > linkData.activationTime) {
            linkItem.className += ' active'; // Добавляем класс "active", если время активации истекло
        }

        const shortLink = linkData.link.length > 30 ? linkData.link.substring(0, 30) + '...' : linkData.link; // Сокращаем ссылку, если она слишком длинная

        // Создаем HTML-код для элемента ссылки
        linkItem.innerHTML = `
            <a href="#" onclick="copyLink('${linkData.link}')">${shortLink}</a>
            <span>${linkData.formattedTime}</span>
            <button class="delete-button" onclick="deleteLink(${index})">Удалить</button>
        `;

        linkList.appendChild(linkItem); // Добавляем элемент ссылки в список
    });
}

// Функция для удаления ссылки
function deleteLink(index) {
    let links = JSON.parse(localStorage.getItem('links')) || []; // Получаем сохраненные ссылки из localStorage или создаем пустой массив
    links.splice(index, 1); // Удаляем ссылку из массива
    localStorage.setItem('links', JSON.stringify(links)); // Сохраняем обновленный массив ссылок в localStorage
    displayLinks(); // Обновляем отображение списка ссылок
    updateActiveCount(); // Обновляем количество активных элементов
}

// Функция для копирования ссылки в буфер обмена
function copyLink(link) {
    navigator.clipboard.writeText(link)
        .then(() => {
            showToast(); // Показываем уведомление о успешном копировании
        })
        .catch(err => {
            console.error('Failed to copy text: ', err); // Выводим ошибку в консоль, если копирование не удалось
        });
}

// Функция для показа уведомления
function showToast() {
    const toastMessage = document.getElementById('toastMessage'); // Получаем элемент уведомления
    toastMessage.textContent = 'Ссылка скопирована в буфер обмена!'; // Устанавливаем текст уведомления
    toastMessage.classList.add('show'); // Показываем уведомление

    setTimeout(() => {
        toastMessage.classList.remove('show'); // Скрываем уведомление через 1.5 секунды
    }, 1500);
}

// Функция для обновления количества активных элементов
function updateActiveCount() {
    const links = JSON.parse(localStorage.getItem('links')) || []; // Получаем сохраненные ссылки из localStorage или создаем пустой массив
    const activeCount = links.filter(link => link.status).length; // Подсчитываем количество активных элементов
    const activeCountValue = document.getElementById('activeCountValue'); // Получаем элемент с количеством активных элементов
    activeCountValue.textContent = activeCount; // Обновляем текст элемента с количеством активных элементов

    if (activeCount > 0) {
        activeCountValue.classList.remove('zero'); // Удаляем класс "zero", если количество активных элементов больше нуля
    } else {
        activeCountValue.classList.add('zero'); // Добавляем класс "zero", если количество активных элементов равно нулю
    }
}

// Функция для проверки времени элементов и обновления их статуса
function checkLinkStatuses() {
    const links = JSON.parse(localStorage.getItem('links')) || []; // Получаем сохраненные ссылки из localStorage или создаем пустой массив
    const now = new Date(); // Получаем текущую дату и время

    links.forEach((linkData, index) => { // Перебираем все ссылки
        const elapsedTime = now.getTime() - linkData.timestamp; // Вычисляем прошедшее время с момента добавления ссылки
        const minutesElapsed = elapsedTime / (1000 * 60); // Переводим прошедшее время в минуты

        // Проверяем, истекло ли время активации ссылки
        if (minutesElapsed > linkData.activationTime) {
            linkData.status = true; // Устанавливаем статус ссылки в активный
        }
    });

    localStorage.setItem('links', JSON.stringify(links)); // Сохраняем обновленный массив ссылок в localStorage
    displayLinks(); // Обновляем отображение списка ссылок
    updateActiveCount(); // Обновляем количество активных элементов
}

// Обработчик события загрузки страницы
document.addEventListener('DOMContentLoaded', (event) => {
    updateCurrentTime(); // Обновляем текущее время
    setInterval(updateCurrentTime, 1000); // Обновляем текущее время каждую секунду
    displayLinks(); // Отображаем список ссылок
    updateActiveCount(); // Обновляем количество активных элементов
    setInterval(checkLinkStatuses, 60000); // Проверяем статус ссылок каждую минуту
});
