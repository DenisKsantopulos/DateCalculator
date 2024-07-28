// В этом коде я использовал jQuery, поскольку эта библиотека обеспечивает удобный способ взаимодействия с DOM HTML-документа

$(document).ready(function() {
    // Получаем элементы input и result
    const $input = $('#date-input');
    const $result = $('#result');

    // Переменная для хранения предыдущего значения input
    let lastValue = '';

    $input.on('input', function() {
        const originalDateStr = $input.val();

        // Если поле ввода пустое, очищаем результат и выходим
        if (originalDateStr === '') {
            $result.text('');
            return;
        }

        // Если длина текущего значения меньше предыдущего, обновляем lastValue и выходим
        // нужно, чтобы точка, автоматически проставленная, не удалялась
        if (originalDateStr.length < lastValue.length) {
            lastValue = originalDateStr;
            return;
        }

        // Регулярные выражения для проверки формата даты
        const dayMonthRegex = /^\d{2}$/; // два любых числа
        const monthRegex = /^\d{2}\.\d{2}$/; // два числа, точка, два числа

        // Добавляем точку после введеного числа и месяца
        if (dayMonthRegex.test(originalDateStr)) {
            $input.val(originalDateStr + '.');
            lastValue = originalDateStr + '.';
            return;
        } else if (monthRegex.test(originalDateStr)) {
            $input.val(originalDateStr + '.');
            lastValue = originalDateStr + '.';
            return;
        }
        //lastValue = originalDateStr;

        // Разбиваем строку на день, месяц и год и меняем местами, так как у Date формат mm.dd.yyyy 
        const [month, day, year] = originalDateStr.split(".");
        const dateStr = `${day}.${month}.${year}`;

        // Проверяем корректность даты
        if (day > 12){
            $result.text("Месяц не может быть больше 12");
            return;
        }

        if (month > 31){
            $result.text("День не может быть больше 31");
            return;
        }

        const dateRegex = /^\d{2}\.\d{2}\.\d+$/;
        if (!dateRegex.test(dateStr)) {
            $result.text('Некорректный формат даты');
            return;
        }

        // Создаем объект Date из строки даты
        const date = new Date(dateStr); //.replace(/\./g, '/')
        
        // Проверяем, что дата не в прошлом
        if (date.getTime() < Date.now()) {
            $result.text('Введённая дата уже наступила');
            return;
        }

        // Проверяем, что дата не более чем на 10 лет в будущем
        const maxDate = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
        if (date.getTime() > maxDate.getTime()) {
            $result.text(`Дата не должна быть позже ${maxDate.toLocaleDateString()}`);
            return;
        }

        const dayOfYear = getDayOfYear(date);
        const weekOfYear = getWeekOfYear(date);
        const distanceToToday = getDistanceToToday(date);

        // Выводим результаты
        $result.html(`
            <p>Номер дня в году: ${dayOfYear}</p>
            <p>Номер недели в году: ${weekOfYear}</p>
            <p>Расстояние до текущего дня: ${distanceToToday}</p>
        `);
    });

    // Функция для расчета номера дня в году
    function getDayOfYear(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1); // введенный год, 1 месяц, 1 день
        return Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
    }

    // Функция для расчета номера недели в году
    function getWeekOfYear(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const firstDayOfYear = startOfYear.getDay(); // Получаем день недели для начала года (0 - воскресенье, 1 - понедельник,...)
      
        if (firstDayOfYear !== 1) { // 1 = Monday
          startOfYear.setDate(startOfYear.getDate() + (7 - firstDayOfYear + 1));
        }
      
        const week = Math.floor((date.getTime() - startOfYear.getTime()) / 604800000) + 2; // количество миллисекунд в неделе
        return week;
      }

    function getDistanceToToday(date) {
        const now = new Date();
        const distance = date.getTime() - now.getTime();
        const years = Math.floor(distance / 31536000000); // количество миллисекунд в году
        const days = Math.floor((distance % 31536000000) / 86400000); // количество миллисекунд в сутках
        const hours = Math.floor((distance % 86400000) / 3600000); // количество миллисекунд в часе
        const minutes = Math.floor((distance % 3600000) / 60000); // количество миллисекунд в минуте
        const seconds = Math.floor((distance % 60000) / 1000); // количество миллисекунд в секунде

        return `${years} лет ${days} дней ${hours} часов ${minutes} минут ${seconds} секунд`;
    }

    setInterval(function() {
        const originalDateStr = $input.val();

        const [month, day, year] = originalDateStr.split(".");
        const dateStr = `${day}.${month}.${year}`;
        if (dateStr) {
            const date = new Date(dateStr.replace(/\./g, '/'));
            const distanceToToday = getDistanceToToday(date);
            // Обновляем текст последнего параграфа в результате
            $result.find('p:last-child').text(`Расстояние до текущего дня: ${distanceToToday}`);
        }
    }, 1000); // Обновляем каждую секунду (1000 миллисекунд)
});