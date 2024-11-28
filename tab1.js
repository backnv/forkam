document.addEventListener('DOMContentLoaded', function() {
    const workStatusInput = document.getElementById('workStatus');
    const tsSelect = document.getElementById('tsStatus');
    const bnsoInput = document.getElementById('bnsoInput');
    const ssdInput = document.getElementById('ssdInput');
    const esmInput = document.getElementById('esmInput');
    const voltageInput = document.getElementById('voltageInput');
    const accumulatorInput = document.getElementById('accumulatorInput');
    const batteryInput = document.getElementById('batteryInput');
    const onlineCheckbox = document.getElementById('onlineStatus');
    const outputDiv = document.getElementById('tab1-output');
    const dataParser = document.getElementById('dataParser');

    // Get checkbox elements
    const text1Checkbox = document.getElementById('text1');
    const text2Checkbox = document.getElementById('text2');
    const text3Checkbox = document.getElementById('text3');
    const trustedNumberCommandCheckbox = document.getElementById('trustedNumberCommand');
    const rebootCommandCheckbox = document.getElementById('rebootCommand');
    const navigationMarkCommandCheckbox = document.getElementById('navigationMarkCommand');
    const satelliteLossCheckbox = document.getElementById('satelliteLoss');
    const satelliteNormalCheckbox = document.getElementById('satelliteNormal');
    const stuckCoordinateCheckbox = document.getElementById('stuckCoordinate');

    function formatDate(dateStr) {
        if (!dateStr) return '';

        // Remove double spaces
        dateStr = dateStr.replace(/\s+/g, ' ').trim();

        // Try to parse the date
        let date;
        if (dateStr.includes('-')) {
            date = new Date(dateStr);
        } else {
            // Convert DD.MM.YYYY to YYYY-MM-DD
            const parts = dateStr.split('.');
            if (parts.length === 3) {
                date = new Date(parts[2], parts[1] - 1, parts[0]);
            } else {
                return dateStr;
            }
        }

        if (isNaN(date.getTime())) {
            return dateStr;
        }

        return dateStr;
    }

    function parseTabularData(text) {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return; // Need at least header and data line

        const dataLine = lines[1]; // Get the second line (data)
        const columns = dataLine.split('\t');

        // Parse SSD date (index 2 - "Ответ от ССД")
        if (columns[2]) {
            ssdInput.value = formatDate(columns[2].trim());
        }

        // Parse ESM date (index 3 - "Ответ от ЕСМ")
        if (columns[3]) {
            esmInput.value = formatDate(columns[3].trim());
        }

        // Parse voltage (index 5 - "U АКБ ТС В.")
        if (columns[5]) {
            voltageInput.value = columns[5].trim();
        }

        // Trigger update
        updateOutput();
    }

    function updateInputStates() {
        const isOnline = onlineCheckbox.checked;
        ssdInput.disabled = isOnline;
        esmInput.disabled = isOnline;
        if (isOnline) {
            ssdInput.value = 'online';
            esmInput.value = 'online';
        }
        updateOutput();
    }

    function updateOutput() {
        const values = [];

        // Handle work status input
        const workValue = workStatusInput.value.trim();
        values.push(workValue === '' ? 'Выездов ранее не было' : 'Пред. выезд: ' + formatDate(workValue));

        // Handle TS status
        const tsValue = tsSelect.value;
        if (tsValue !== '') {
            values.push('ТС ' + tsValue.toUpperCase());
        }

        // Handle BNSO input
        const bnsoValue = bnsoInput.value.trim();
        if (bnsoValue !== '') {
            values.push('блок ' + formatDate(bnsoValue));
        }

        // Handle SSD and ESM inputs only if online is not checked
        if (!onlineCheckbox.checked) {
            const ssdValue = ssdInput.value.trim();
            const esmValue = esmInput.value.trim();

            if (ssdValue !== '') {
                values.push('ССД ' + formatDate(ssdValue));
            }
            if (esmValue !== '') {
                values.push('ЕСМ ' + formatDate(esmValue));
            }
        } else {
            values.push('ССД и ЕСМ online');
        }

        //Add text-up to first input
        const listItems = document.querySelectorAll('ul.text-up li');

        listItems.forEach(item => {
            item.addEventListener('click', function(event) {
                event.stopPropagation(); // Предотвращаем всплытие события
                // Найти ближайший родительский элемент <ul>
                const parentUl = item.closest('ul');
                // Найти первый input или textarea выше этого <ul>
                let element = parentUl.previousElementSibling;
                while (element && element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
                    element = element.previousElementSibling;
                }
                if (element) {
                    const newText = item.getAttribute("data-ref");
                    if (element.tagName === 'TEXTAREA') {
                        if (element.value.trim() === '') {
                            element.value = newText;
                        } else {
                            // Проверяем, что текст еще не добавлен
                            if (!element.value.includes(newText)) {
                                element.value += ' / ' + newText;
                            }
                        }
                    } else {
                        element.value = newText;
                    }
                }
            });
        });

        // Handle voltage input
        const voltageValue = voltageInput.value.trim();
        if (voltageValue === '') {
            values.push('АКБ нет данных');
        } else {
            values.push('U АКБ ТС В. ' + formatDate(voltageValue));
        }

        // Handle accumulator state input
        const accumulatorValue = accumulatorInput.value.trim();
        if (accumulatorValue !== '') {
            values.push('АКБ ' + formatDate(accumulatorValue));
        }

        // Handle battery input
        const batteryValue = batteryInput.value.trim();
        if (batteryValue !== '') {
            values.push('' + formatDate(batteryValue));
        }

        // Add checkbox texts if checked
        if (text1Checkbox.checked) values.push('Text1');
        if (text2Checkbox.checked) values.push('Text2');
        if (text3Checkbox.checked) values.push('Text3');
        if (rebootCommandCheckbox.checked) values.push('Направлена команда перезагрузки');
        if (trustedNumberCommandCheckbox.checked) values.push('Направлена команда доверенного номера');
        if (navigationMarkCommandCheckbox.checked) values.push('Направлена команда навигационной отметки');
        if (satelliteLossCheckbox.checked) values.push('Потеря спутников');
        if (satelliteNormalCheckbox.checked) values.push('Спутники в норме');
        if (stuckCoordinateCheckbox.checked) values.push('Зависание в одной координате');

        outputDiv.textContent = values.join(' / ');
    }

    // Add event listeners
    dataParser.addEventListener('input', function() {
        parseTabularData(this.value);
    });

    const toastMessage = document.getElementById('toastMessage');

    function showToast() {
        toastMessage.textContent = 'Скопировано!';
        toastMessage.classList.add('show');

        setTimeout(() => {
            toastMessage.classList.remove('show');
        }, 1500);
    }

    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const text = this.dataset.text;
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast();
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });
    });
    document.querySelectorAll('.copy-text').forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast();
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });
    });

    

    workStatusInput.addEventListener('input', updateOutput);
    tsSelect.addEventListener('change', updateOutput);
    bnsoInput.addEventListener('input', updateOutput);
    ssdInput.addEventListener('input', updateOutput);
    esmInput.addEventListener('input', updateOutput);
    voltageInput.addEventListener('input', updateOutput);
    accumulatorInput.addEventListener('input', updateOutput);
    batteryInput.addEventListener('input', updateOutput);

    onlineCheckbox.addEventListener('change', function() {
        updateInputStates();
        updateOutput();
    });

    // Add event listeners for checkboxes
    text1Checkbox.addEventListener('change', updateOutput);
    text2Checkbox.addEventListener('change', updateOutput);
    text3Checkbox.addEventListener('change', updateOutput);
    rebootCommandCheckbox.addEventListener('change', updateOutput);
    trustedNumberCommandCheckbox.addEventListener('change', updateOutput);
    navigationMarkCommandCheckbox.addEventListener('change', updateOutput);
    satelliteLossCheckbox.addEventListener('change', updateOutput);
    satelliteNormalCheckbox.addEventListener('change', updateOutput);
    stuckCoordinateCheckbox.addEventListener('change', updateOutput);

    // Initial setup
    updateInputStates();
    updateOutput();


    // Clear all fields function
    function clearAllFields() {
        workStatusInput.value = '';
        tsSelect.value = 'Исправно';
        bnsoInput.value = '';
        ssdInput.value = '';
        esmInput.value = '';
        voltageInput.value = '';
        accumulatorInput.value = '';
        batteryInput.value = '';
        onlineCheckbox.checked = false;
        text1Checkbox.checked = false;
        text2Checkbox.checked = false;
        text3Checkbox.checked = false;
        trustedNumberCommandCheckbox.checked = false;
        rebootCommandCheckbox.checked = false;
        navigationMarkCommandCheckbox.checked = false;
        satelliteLossCheckbox.checked = false;
        satelliteNormalCheckbox.checked = false;
        stuckCoordinateCheckbox.checked = false;
        dataParser.value = '';
        outputDiv.textContent = '';

        updateInputStates();
        updateOutput();
    }

    // Add event listener for the clear button
    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', clearAllFields);
});

