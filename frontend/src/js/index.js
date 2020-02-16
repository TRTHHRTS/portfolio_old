require('babel-polyfill');

import Vue from 'vue/dist/vue.esm.js';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm.js';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/design.scss';

import HTS from './HTS.vue';
import NewHTS from './NewHTS.vue';
import NewHTSPolicy from './NewHTSPolicy.vue';
import HTSPolicy from './HTSPolicy.vue';
import Home from './Home.vue';
import {localization} from './i18n.js';

Vue.use(BootstrapVue);
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueI18n);

const routes = [
    { path: '/', component: Home },
    { path: '/htremote', component: NewHTS },
    { path: '/htremote/policy', component: NewHTSPolicy },
    { path: '/hts', component: HTS },
    { path: '/hts/policy', component: HTSPolicy }
];

const router = new VueRouter({
    routes
});


const i18n = new VueI18n({
    locale: 'en',
    localization
});

Vue.prototype.$locale = {
    change(language) {
        i18n.locale = language;
    },
    current() {
        return i18n.locale;
    }
};

new Vue({
    el: '#app',
    router,
    i18n
});

