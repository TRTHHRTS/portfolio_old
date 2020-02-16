<template>
    <div>
        <h1 class="alignC">{{$t('hts2.title')}}</h1>
        <div>
            <b-button to="/" variant="outline-secondary" class="mb10">{{$t("back_btn")}}</b-button>
            <b-form-radio-group id="lang_group" buttons button-variant="outline-warning"
                                v-model="currentLang" class="floatR"
                                :options="langs"
                                name="radioBtnOutline" ></b-form-radio-group>
        </div>
        <div class="alignC">
            <!--suppress CheckImageSize -->
            <img src="../static/htremote.png" width="256"/>
            <p><strong>{{$t("hts2.download_info")}}</strong><b-button variant="outline-primary ml10" size="lg" @click="downloadDist">{{$t("hts.download")}}</b-button></p>
            <i18n tag="p" path="hts2.gp">
                <a href="https://play.google.com/store/apps/details?id=com.trueberry.htremote" place="link">Google play</a>
            </i18n>
        </div>
        <div style="width: 500px; margin: 0 auto;">
            <div><router-link to="/htremote/policy" class="mb10"><b>{{$t("hts2.policy")}}</b></router-link></div>
            <div><a href="https://github.com/TRTHHRTS/hts_2" class="mb10"><b>GitHub</b></a></div>
            <h3>{{$t('hts2.setting')}}</h3>
            <p>{{$t('hts2.mpc')}}</p>
            <template v-if="currentLang === 'ru'">
                <img src="../static/mpc_settings.png" />
            </template>
            <template v-else>
                <img src="../static/mpc_settings_en.png" />
            </template>
        </div>
    </div>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                currentLang: 'en',
                langs: [
                    { text: 'RU', value: 'ru' },
                    { text: 'EN', value: 'en' }
                ]
            }
        },
        watch: {
            currentLang: function (val) {
                this.$locale.change(val);
            }
        },
        computed: {
            isEng() {
                return this.$parent.currentLang === 'en';
            }
        },
        methods: {
            downloadDist() {
                window.open('/files/HTS2.zip');
            }
        }
    }
</script>