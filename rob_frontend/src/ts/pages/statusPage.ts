import Component from "vue-class-component";
import Vue from "vue";
import * as moment from "moment";

@Component({
    // language=Vue
    template: `
<div>
    <div class="alignC mb10">
        <h3>Информация о работе бота</h3>
        <el-button v-if="!loading" type="primary" plain @click="requestNewLogs" :disabled="!!commands">
            {{commands ? 'Логи уже были запрошены ранее, ожидайте' : 'Запросить новые логи'}}
        </el-button>
    </div>
    <div v-if="loading" class="alignC">
        <i class="el-icon-loading"></i>
    </div>
    <p v-if="lastLogsDate">Дата последней загрузки логов: {{lastLogsDate}}</p>
    <p v-if="!loading && !lastLogsDate">Логов на сервере не найдено</p>
    <div v-if="log" style="background-color: gainsboro; padding: 5px;"><span v-html.lazy="log"></span></div>
</div>
`})
export class StatusPage extends Vue {

    /** Логи работы бота */
    private log = "";

    /** Дата логов */
    private lastLogsDate: string = <any> null;

    /** Количество команд на сервере */
    private commands = 0;

    /** Признак загрузки логов */
    private loading = false;

    /** Хук */
    private async created() {
        const telegramId = this.$cookies.get("telegramId");
        const token = this.$cookies.get("token");
        if (!telegramId || !token) {
            // @ts-ignore
            this.$message({type: 'info', message: `Стоит сначала пройти аутентификацию.`});
            await this.$router.push("/auth");
            return;
        }
        try {
            this.loading = true;
            const result = (await this.$http.get(`https://trthhrts.ru/rob/logs/${telegramId}`)).data;
            this.commands = result.commands;
            if (result.date && result.log) {
                this.lastLogsDate = moment(new Date(Number(result.date))).format('HH:mm DD.MM.YYYY');
                this.log = (<string> result.log).replace(/\n/g, "<br/>");
            }
        } finally {
            this.loading = false;
        }
    }

    /**
     * Запросить новые логи с сервера
     */
    private async requestNewLogs() {
        await this.$http.post(`https://trthhrts.ru/rob/request_logs`);
        this.commands++;
        // @ts-ignore
        this.$message({type: 'success', message: `Логи запрошены. Это займет некоторое время. Когда логи будут загружены, мы сообщим вам в Telegram`});
    }
}