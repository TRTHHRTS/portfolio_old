import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueResource from 'vue-resource';
import VueRouter from "vue-router";
import {RouterConfiguration} from "./routerConfiguration";
import {install} from "vue-cookies";
import {store} from "./store";
import "../scss/custom.scss";
import {messages} from "./lang";

const ElementUI = require('element-ui');

const App = () => import("./pages/App");

(async () => {
    Vue.use(ElementUI);
    Vue.use(VueResource);
    Vue.use(VueRouter);
    Vue.use(VueI18n);
    install(Vue);

    // Кладем токен аутентификации в заголовок запросов
    (<any> Vue).http.interceptors.push((request: any, next: any) => {
        request.headers.set('x-access-token', Vue.cookies.get("token"));
        next((response: any) => {
            if(response.status == 401) {
                Vue.cookies.remove("token");
                alert(response.body);
                router.push("/main");
            }
        });
    });

    const router = RouterConfiguration.getRouter();
    // Получаем локаль из куков, если есть
    const lang = Vue.cookies.get("lang");
    // Настройки локализации
    const i18n = new VueI18n({
        locale: lang || "ru",
        messages
    });

    // Настраиваем методы смены локали и получения текущей локали
    // TODO можно переделать на более красивое решение
    Vue.prototype.$locale = {
        change(language: string) {
            i18n.locale = language;
        },
        current() {
            return i18n.locale;
        }
    };

    new Vue({
        el: '#app',
        i18n,
        store,
        render: h => h(App),
        router
    });
})();