import Component from "vue-class-component";
import Vue from "vue";

@Component({
    // language=Vue
    template: `
<div class="w400 mAuto alignC">
    <div v-if="!codeSent">
        <p>Введите Telegram ID в поле ниже и нажмите кнопку "Задать".</p>
        <el-input v-model="inputId" class="mb10"></el-input>
        <el-button type="primary" @click="installTelegramId">Задать</el-button>
    </div>
    <div v-else>
        <p>Мы отправили вам <b>(ID={{$route.params.id}})</b> одноразовый код с помощью Telegram-бота <b><a href="https://t.me/riseofbot" target="_blank">@riseofbot</a></b></p>
        <p>Введите его в поле ниже и нажмите кнопку "Подтвердить".</p>
        <el-input v-model="code" class="mb10"></el-input>
        <el-button type="primary" @click="checkCode">Подтвердить</el-button>
    </div>
</div>
`})
export class AuthPage extends Vue {

    /** Одноразовый код подтверждения */
    private code: string = "";

    /** Введенный идентификатор пользователя */
    private inputId: string = "";

    /** Признак отправки кода */
    private codeSent = false;

    /** Хук */
    private async mounted() {
        if (this.$cookies.get("telegramId") && this.$cookies.get("token")) {
            // @ts-ignore
            this.$message({type: 'info', message: `Кажется, мы вас узнали, аутентификация не требуется`});
            this.$router.push("/settings");
            return;
        }
        const telegramId = this.$route.params.id || this.$cookies.get("telegramId");
        if (telegramId) {
            await this.sendPushCode(telegramId);
        }
    }

    /**
     * Отправляет одноразовый код
     * @param telegramId идентификатор пользователя
     */
    private async sendPushCode(telegramId: string) {
        if (isNaN(parseInt(telegramId))) {
            // @ts-ignore
            this.$message({type: 'error', message: `Некорректный Telegram ID: "${telegramId}"`});
            this.$router.push("/main");
            return;
        }
        await this.$http.post("https://trthhrts.ru/rob/sendCode", {id: telegramId});
        this.$route.params.id = telegramId;
        this.codeSent = true;
    }

    /**
     * Устанавливает Telegram ID
     */
    private async installTelegramId() {
        if (this.inputId) {
            await this.sendPushCode(this.inputId);
        }
    }

    /**
     * Проверяет одноразовый код
     */
    private async checkCode() {
        if (this.code) {
            const response = await this.$http.post("https://trthhrts.ru/rob/check", {id: this.$route.params.id, code: this.code});
            const token = response.data.token;
            if (token) {
                this.$cookies.set("telegramId", this.$route.params.id, "100d");
                this.$cookies.set("token", token, "12h");
                this.$router.push("/settings");
            }
        } else {
            // @ts-ignore
            this.$message({type: 'error', message: `Ничего не введено`});
        }
    }
}