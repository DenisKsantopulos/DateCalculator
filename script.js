$(document).ready(function() {
    const $input = $('#date-input');
    const $result = $('#result');

    let lastValue = '';

    $input.on('input', function() {
        const originalDateStr = $input.val();
        if (originalDateStr === '') {
            $result.text('');
            return;
        }

        if (originalDateStr.length < lastValue.length) {
            lastValue = originalDateStr;
            return;
        }

        const dayMonthRegex = /^\d{2}$/;
        const monthRegex = /^\d{2}\.\d{2}$/;

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

        const [month, day, year] = originalDateStr.split(".");
        const dateStr = `${day}.${month}.${year}`;

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

        const date = new Date(dateStr); //.replace(/\./g, '/')
        if (date.getTime() < Date.now()) {
            $result.text('Введённая дата уже наступила');
            return;
        }

        const maxDate = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
        if (date.getTime() > maxDate.getTime()) {
            $result.text(`Дата не должна быть позже ${maxDate.toLocaleDateString()}`);
            return;
        }

        const dayOfYear = getDayOfYear(date);
        const weekOfYear = getWeekOfYear(date);
        const distanceToToday = getDistanceToToday(date);

        $result.html(`
            <p>Номер дня в году: ${dayOfYear}</p>
            <p>Номер недели в году: ${weekOfYear}</p>
            <p>Расстояние до текущего дня: ${distanceToToday}</p>
        `);
    });

    function getDayOfYear(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1); // введенный год, 1 месяц, 1 день
        return Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
    }

    function getWeekOfYear(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const firstDayOfYear = startOfYear.getDay(); // get the day of the week of the first day of the year (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      
        // adjust the start of the year to the first Monday of the year
        if (firstDayOfYear !== 1) { // 1 = Monday
          startOfYear.setDate(startOfYear.getDate() + (7 - firstDayOfYear + 1));
        }
      
        const week = Math.floor((date.getTime() - startOfYear.getTime()) / 604800000) + 2;
        return week;
      }

    function getDistanceToToday(date) {
        const now = new Date();
        const distance = date.getTime() - now.getTime();
        const years = Math.floor(distance / 31536000000);
        const days = Math.floor((distance % 31536000000) / 86400000);
        const hours = Math.floor((distance % 86400000) / 3600000);
        const minutes = Math.floor((distance % 3600000) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);

        return `${years} лет ${days} дней ${hours} часов ${minutes} минут ${seconds} секунд`;
    }

    setInterval(function() {
        const originalDateStr = $input.val();

        const [month, day, year] = originalDateStr.split(".");
        const dateStr = `${day}.${month}.${year}`;
        if (dateStr) {
            const date = new Date(dateStr.replace(/\./g, '/'));
            const distanceToToday = getDistanceToToday(date);
            $result.find('p:last-child').text(`Расстояние до текущего дня: ${distanceToToday}`);
        }
    }, 1000);

});