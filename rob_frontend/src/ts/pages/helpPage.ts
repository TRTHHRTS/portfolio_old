import Component from "vue-class-component";
import Vue from "vue";

@Component({
    // language=Vue
    template: `
<div>
    <h3 class="alignC">Помощь по работе с ботом</h3>
    <div>
        <h3>Инструкция по первому запуску</h3>
        <h3><span class="warn-text">!!! Бот запускается на ПК / НОУТБУКЕ с WINDOWS 7 и выше !!!</span></h3>
        <h4>1. Установка эмулятора android</h4>
        <ul>
            <li>Скачиваем эмулятор <a href="https://www.memuplay.com/" target="_blank">MEmuEmulator</a></li>
            <li>Устанавливаем эмулятор</li>
            <li>Запускаем эмулятор и устанавливаем игру на эмулятор</li>
            <li>Заходим в игру под нужным аккаунтом, на котором будет запущен бот</li>
            <li>Выходим из игры, закрываем эмулятор</li>
        </ul>
        <h5><span class="warn-text">ВНИМАНИЕ:</span> Язык игры должен быть выставлен русский</h5>
        <h5><span class="warn-text">ВНИМАНИЕ:</span> Если у вас зависает эмулятор при загрузке, возможно, вы сможете найти ответ <a href="https://www.memuplay.com/blog/2016/03/01/how-to-solve-start-failure/" target="_blank">тут</a></h5>
        <h4>2. Заходим в телеграм бота <a href="https://t.me/riseofbot" target="_blank">@riseofbot</a></h4>
        <h5><span class="warn-text">ВНИМАНИЕ:</span> Если ссылка выше не открывается (из-за блокировок), то можете найти бота в Telegram вручную, введите в поиске <b>@riseofbot</b></h5>
        <ul>
            <li>Пишем <b>/start</b> чтобы войти в главное меню бота</li>
            <li>Жмем "получить идентификатор (ID)"</li>
            <li>Копируем идентификатор в виде цифр</li>
        </ul>
        <h4>3. Скачиваем <a href="http://trthhrts.ru/rob/distributive" target="_blank">дистрибутив бота тут</a></h4>
        <ul>
            <li>Распаковываем архив и запускаем startBot.bat</li>
            <li>В диалоге попросят ввести идентификатор полученный на шаге 2 и путь до эмулятора установленного на шаге 1. Вводим и жмем OK</li>
        </ul>
        <h4>4. Эмулятор сам запустится и бот начнет работать. Но он ещё не настроен.</h4>
        <ul>
            <li>
                После запуска игры вам придет сообщение о загрузке изображения вашей деревни с просьбой задать координаты.
                Заходим в настройки через телеграм бота <a href="https://t.me/riseofbot" target="_blank">@riseofbot</a> (в главном меню бота нажать на "Настройки").
                Чтобы войти в главное меню бота, напишите ему <b>/start</b>
            </li>
            <li>Открываем вкладку "Координаты зданий"</li>
            <li>Задаем координаты зданий. <span class="warn-text"><b>ВАЖНО:</b></span> для того что бы можно было задать координаты всех требуемых зданий, они должны находиться все ближе к центру деревни</li>
            <li><b>Полезно, но не обязательно:</b> Так же просмотрите настройки и выставите значения под себя, там много полезного</li>
            <li>Жмём "Сохранить"</li>
            <li>Через пару минут бот подхватит настройки и сообщит вам в телеграм. Все возможности бота будут активны</li>
        </ul>
        <h4>
            5. Что бы зайти в игру самому, нужно приостановить бота.
            Для этого в телеграмм бота пишем /стоп и дожидаемся сообщения об остановке бота.
            Что бы продолжить работу бота, пишем в телеграм /старт
        </h4>
        <h4>6. Идём наливать себе кофе и заниматься важными делами, пока бот за вас играет</h4>
        <h4 class="alignC"><b>Приятного использования</b></h4>
        <h4>P.S. Если у вас возникли непреодолимые сложности, обращайтесь в telegram: <b><a href="https://t.me/dmitriy_bv" target="_blank">@dmitriy_bv</a></b> или <b><a href="https://t.me/trthhrts" target="_blank">@trthhrts</a></b></h4>
    </div>
</div>
`})
export class HelpPage extends Vue {
}