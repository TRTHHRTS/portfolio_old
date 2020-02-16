import Component from "vue-class-component";
import Vue from "vue";

const logo = require("/src/static/game_logo.jpg");

@Component({
    // language=Vue
    template: `
<div class="alignC">
    <div class="mAuto" style="max-width: 1300px;">
        <h3>{{$t("home.text1")}}</h3>
        <a target="_blank" href="https://play.google.com/store/apps/details?id=com.lilithgame.roc.gp"><img :src="game_logo" width="100px" height="100px" class="game_logo" alt="logo"></a>
        <p><router-link to="/help"><el-button type="warning">{{$t("home.text2")}}</el-button></router-link></p>
        <hr/>
        <h4><b><span class="warn-text">ВНИМАНИЕ!</span> Оставить обратную связь или задать вопрос вы можете через Telegram-бота (в главном меню выберите "Обратная связь")</b></h4>
    </div>
    <h4>Бот умеет</h4>
    <el-table :data="tableData" style="max-width: 1000px;" class="mAuto" show-header="false" size="small">
        <el-table-column prop="text"></el-table-column>
    </el-table>
</div>
`})
export class MainPage extends Vue {

    /** Логотип игры */
    private get game_logo() {
        return logo;
    }

    /**
     * Данные для таблицы
     */
    private get tableData() {
        return [
            {text: "Строить здания"},
            {text: "Собирать круглосуточно ресурсы выбранного вами уровня на карте, избегая вражеских территорий"},
            {text: "Собирать ресурсы в деревне"},
            {text: "Атаковать варваров выбранного вами уровня на карте круглосуточно (по откату очков действий)"},
            {text: "Обучать войнов круглосуточно"},
            {text: "Исследовать туман войны, собирать сундуки из пещер и собирать бонусы племен"},
            {text: "Изучать технологии в академии"},
            {text: "Покупать за ресурсы ускорения и ресурсы у таинственной торговки, которая с ботом появляется практические каждые 2-3 часа"},
            {text: "При атаке на Вас, отзывает все войска и ждет некоторое время. Потом возобновляет работу"},
            {text: "Взаимодействовать с Альянсом:"},
            {text: "- Присоединяться к походам альянса, определяя время марша до этого похода. В случае если поход далеко, пропускает его, что бы не раздражать членов вашего альянса"},
            {text: "- Кликать руку помощи членам вашего альянса"},
            {text: "- Изучать технологии альянса"},
            {text: "Собирать сундуки в таверне"},
            {text: "Собирать награды за задания и ежедневные задания"},
            {text: "Собирать ежедневную награду за VIP"},
            {text: "Информирует о особо важных моментах в telegram"}
        ];
    }
}