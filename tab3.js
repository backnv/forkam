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

    const commentInput = document.getElementById('commentInput'); // Получаем элемент ввода комментария
    const comment = commentInput.value.trim(); // Получаем значение комментария и удаляем пробелы по краям

    const activationTimeInput = document.getElementById('activationTimeInput'); // Получаем элемент ввода времени активации
    const activationTime = parseInt(activationTimeInput.value.trim(), 10); // Получаем значение времени активации и преобразуем в число

    const now = new Date(); // Получаем текущую дату и время
    const timestamp = now.getTime(); // Получаем текущее время в миллисекундах
    const formattedTime = now.toLocaleString(); // Форматируем время в строку

    // Создаем объект с данными ссылки
    const linkData = {
        link: link,
        comment: comment,
        timestamp: timestamp,
        formattedTime: formattedTime,
        status: false, // Начальный статус не "В работе"
        activationTime: activationTime // Время, через которое ссылка станет активной
    };

    let links = JSON.parse(localStorage.getItem('links')) || []; // Получаем сохраненные ссылки из localStorage или создаем пустой массив
    links.push(linkData); // Добавляем новую ссылку в массив
    localStorage.setItem('links', JSON.stringify(links)); // Сохраняем обновленный массив ссылок в localStorage

    linkInput.value = ''; // Очищаем поле ввода ссылки
    commentInput.value = ''; // Очищаем поле ввода комментария
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

        // Создаем HTML-код для элемента ссылки
        linkItem.innerHTML = `
            <a href="#" onclick="copyLink('${linkData.link}')">${index + 1}</a>
            <span>${linkData.formattedTime}</span>
            <span>${linkData.comment}</span>
            <button class="delete-button" onclick="confirmDelete(${index}, event)">
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="invert(0%)" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L6 6M6 6L10 10M6 6V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18M6 6H4M10 10L14 14M10 10V17M14 14L18 18M14 14V17M18 18L21 21M18 6V12.3906M18 6H16M18 6H20M16 6L15.4558 4.36754C15.1836 3.55086 14.4193 3 13.5585 3H10.4415C9.94239 3 9.47572 3.18519 9.11861 3.5M16 6H11.6133" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;

        linkItem.addEventListener('click', () => editComment(index)); // Добавляем обработчик события для редактирования комментария

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

// Функция для подтверждения удаления ссылки
function confirmDelete(index, event) {
    event.stopPropagation(); // Останавливаем всплытие события
    if (confirm('Вы уверены, что хотите удалить эту ссылку?')) {
        deleteLink(index); // Удаляем ссылку, если пользователь подтвердил
    }
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

// Функция для редактирования комментария
function editComment(index) {
    const links = JSON.parse(localStorage.getItem('links')) || []; // Получаем сохраненные ссылки из localStorage или создаем пустой массив
    const linkData = links[index]; // Получаем данные ссылки по индексу
    const newComment = prompt('Введите новый комментарий:', linkData.comment); // Запрашиваем новый комментарий у пользователя

    if (newComment !== null) {
        linkData.comment = newComment.trim(); // Обновляем комментарий
        localStorage.setItem('links', JSON.stringify(links)); // Сохраняем обновленный массив ссылок в localStorage
        displayLinks(); // Обновляем отображение списка ссылок
    }
}

// Обработчик события загрузки страницы
document.addEventListener('DOMContentLoaded', (event) => {
    updateCurrentTime(); // Обновляем текущее время
    setInterval(updateCurrentTime, 60000); // Обновляем текущее время каждую секунду
    displayLinks(); // Отображаем список ссылок
    updateActiveCount(); // Обновляем количество активных элементов
    setInterval(checkLinkStatuses, 60000); // Проверяем статус ссылок каждую минуту
});
