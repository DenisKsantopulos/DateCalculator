$(document).ready(function() {
    const $input = $('#date-input');
    const $result = $('#result');

    $input.on('input', function() {
        const originalDateStr = $input.val();

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

        // console.log(dateStr)
        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!dateRegex.test(dateStr)) {
            $result.text('Некорректный формат даты');
            return;
        }

        const date = new Date(dateStr); //.replace(/\./g, '/')
        // console.log(date)
        if (date.getTime() < Date.now()) {
            $result.text('Введённая дата уже наступила');
            return;
        }

        const maxDate = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
        if (date.getTime() > maxDate.getTime()) {
            $result.text(`Дата не должна быть позже ${maxDate.toLocaleDateString()}`);
            return;
        }

    });

});