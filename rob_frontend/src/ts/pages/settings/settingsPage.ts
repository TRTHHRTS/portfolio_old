import Component from "vue-class-component";
import Vue from "vue";
import {SettingsType} from "./settingsTypes";
import {SettingsCommonPanel} from "./panels/settingsCommonPanel";
import {SettingsSwitchesPanel} from "./panels/settingsSwitchesPanel";
import {SettingsCoordinatesPanel} from "./panels/settingsCoordinatesPanel";

@Component({
    // language=Vue
    template: `
<div>
    <div v-if="!settings" class="alignC">
        <i class="el-icon-loading"></i>
    </div>
    <div v-if="settings">
        <div class="alignC">
            <el-button type="primary" @click="requestVillageScreen" plain>{{$t("settings.screen_request")}}</el-button>
            <el-button type="success" @click="saveSettings" plain>{{$t("settings.save")}}</el-button>
            <el-button @click="$router.push('/main')" plain>{{$t("settings.cancel")}}</el-button>
        </div>
        <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('settings.commonTab')" name="common_settings" class="w800 mAuto">
                <settings-common-panel :settings="settings"></settings-common-panel>
            </el-tab-pane>
            <el-tab-pane :label="$t('settings.switchesTab')" name="switches_settings" class="w800 mAuto">
                <settings-switches-panel :settings="settings"></settings-switches-panel>
            </el-tab-pane>
            <el-tab-pane :label="$t('settings.coordinatesTab')" name="coordinates_settings">
                <settings-coordinates-panel :settings="settings" @onCoordsChange="saveSettings"></settings-coordinates-panel>
            </el-tab-pane>
        </el-tabs>
    </div>
</div>
`,
components: {SettingsCommonPanel, SettingsSwitchesPanel, SettingsCoordinatesPanel}})
export class SettingsPage extends Vue {

    /** Название активного таба */
    private activeTab = "common_settings";

    /** Пользовательские настройки бота */
    private settings: SettingsType = <any> null;

    /**
     * Хук
     */
    private async created() {
        const telegramId = this.$cookies.get("telegramId");
        const token = this.$cookies.get("token");
        if (!telegramId || !token) {
            // @ts-ignore
            this.$message({type: 'info', message: `Стоит сначала пройти аутентификацию.`});
            await this.$router.push("/auth");
            return;
        }
        const response = await this.$http.get(`https://trthhrts.ru/rob/settings/${telegramId}`);
        this.settings = response.data;
    }

    /**
     * Сохраняет настройки пользователя
     */
    private async saveSettings() {
        const data = JSON.stringify(this.settings);
        const response = await this.$http.post(`https://trthhrts.ru/rob/settings`, {settings: data});
        // @ts-ignore
        this.$message({type: 'success', message: `Настройки сохранены`});
    }

    /**
     * Запрашивает новый скрин деревни
     */
    private async requestVillageScreen() {
        // TODO!
    }
}