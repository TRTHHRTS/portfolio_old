<template>
    <div>
        <h1 class="alignC">HOME THEATER SERVER</h1>
        <div>
            <b-button to="/" variant="outline-secondary" class="mb10">{{$t("back_btn")}}</b-button>
            <b-form-radio-group id="lang_group" buttons button-variant="outline-warning"
                                v-model="currentLang" class="floatR"
                                :options="langs"
                                name="radioBtnOutline" ></b-form-radio-group>
        </div>
        <p style="margin-top: 10px;" v-html="$t('hts.desc')"></p>
        <router-link to="/hts/policy"><b>{{$t("menu.policy")}}</b></router-link>
        <div class="alignC">
            <strong>{{$t("hts.download_info")}}</strong><b-button variant="outline-primary ml10" @click="downloadDist">{{$t("hts.download")}}</b-button>
        </div>
        <div class="alignC">
            <span>{{$t("hts.download_text")}}<a href="https://play.google.com/store/apps/details?id=com.trueberry.hometheatre" target="_blank"><strong>Google Play</strong></a>.</span>
        </div>
        <div class="help_block">
            <p><b>{{$t('instruction.title')}}</b></p>
            <p>{{$t('instruction.i1')}}</p>
            <img v-show="$locale.current() === 'ru'" src="../static/settings.png"/>
            <img v-show="$locale.current() !== 'ru'" src="../static/settings_en.png"/>
            <p>{{$t('instruction.i2')}}</p>
            <img v-show="$locale.current() === 'ru'" src="../static/mpc_settings.png"/>
            <img v-show="$locale.current() !== 'ru'" src="../static/mpc_settings_en.png"/>
            <p>{{$t('instruction.i2_5')}}</p>
            <img v-show="$locale.current() === 'ru'" src="../static/language.png"/>
            <img v-show="$locale.current() !== 'ru'" src="../static/language_en.png"/>
            <p>{{$t('instruction.i3')}}</p>
            <img v-show="$locale.current() === 'ru'" src="../static/ht_server.png"/>
            <img v-show="$locale.current() !== 'ru'" src="../static/ht_server_en.png"/>
            <p>{{$t('instruction.i4')}}</p>
            <img v-show="$locale.current() === 'ru'" src="../static/mobile.png"/>
            <img v-show="$locale.current() !== 'ru'" src="../static/mobile_en.png"/>
        </div>
    </div>
</template>
<style lang="scss">

</style>
<script>
    export default {
        props: {},
        data(){
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
        methods: {
            downloadDist() {
                window.open('/files/HTS.zip');
            }
        }
    }
</script>