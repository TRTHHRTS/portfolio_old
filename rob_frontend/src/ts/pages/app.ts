import Component from "vue-class-component";
import Vue from "vue";

@Component({
    // language=Vue
    template: `
    <div id="app">
        <el-menu mode="horizontal"
                 background-color="#EA0037" router
                 text-color="#fff"
                 active-text-color="#ffd04b">
            <el-menu-item index="/main">{{$t('app.menu_main')}}</el-menu-item>
            <el-menu-item index="/settings">{{$t('app.menu_settings')}}</el-menu-item>
            <el-menu-item index="/status">{{$t('app.menu_status')}}</el-menu-item>
            <el-menu-item index="/help">{{$t('app.menu_help')}}</el-menu-item>
            
            <el-menu-item class="floatR">
                <el-dropdown @command="changeLocale">
                <span class="el-dropdown-link">
                    {{$t('app.menu_lang')}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="ru">Русский</el-dropdown-item>
                        <el-dropdown-item command="en">English</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-menu-item>
        </el-menu>
        <main>
            <div class="content" style="">
                <router-view class="m10"></router-view>
            </div>
        </main>
    </div>`
})
export default class App extends Vue {

    /**
     * Меняет локаль приложения
     * @param newLocale новая локаль
     */
    private async changeLocale(newLocale: string) {
        this.$cookies.set('lang', newLocale, 10080);
        this.$router.go(0);
    };
}