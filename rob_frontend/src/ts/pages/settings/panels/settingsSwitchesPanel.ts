import Component from "vue-class-component";
import Vue from "vue";
import {BuildMode, FarmKind, ResearchMode, SettingsType} from "../settingsTypes";
import {Prop} from "vue-property-decorator";

@Component({
    // language=Vue
    template: `
<div>
    <div>
        <el-form ref="settings" :model="settings" label-width="400px">
            <el-tooltip placement="top" effect="light">
                <div slot="content">
                    {{$t("settings.commonPanel.buildMode.tooltip1")}}<br/>
                    {{$t("settings.commonPanel.buildMode.tooltip2")}}
                </div>
                <el-form-item :label="$t('settings.switchesPanel.buildMode')">
                    <el-radio-group v-model="settings.buildMode" size="mini">
                        <el-radio-button v-for="item in buildModeValues" :key="item" :label="item">{{$t('BuildMode.' + item)}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-tooltip>
            <el-form-item :label="$t('settings.switchesPanel.researchMode')">
                <el-radio-group v-model="settings.researchMode" size="mini">
                    <el-radio-button v-for="item in researchModeValues" :key="item" :label="item">{{$t('ResearchMode.' + item)}}</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('settings.switchesPanel.farmMode')">
                <el-checkbox-group v-model="settings.farmKinds" size="mini">
                    <el-checkbox-button v-for="item in farmKindValues" :key="item" :label="item">{{$t('FarmKind.' + item)}}</el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
    </div>
    <div class="w390 inline-block alignL vAlignT">
        <p><el-switch v-model="settings.skipRaid" active-text="Пропустить походы в рейды"></el-switch></p>
        <p><el-switch v-model="settings.skipGettingResourcesBonuses" active-text="Пропустить открытие сундуков с ресурсами"></el-switch></p>
        <p><el-switch v-model="settings.skipGuildHelp" active-text="Пропустить помощь альянсу"></el-switch></p>
        <p><el-switch v-model="settings.skipGuildHelpTechnology" active-text="Пропустить помощь в исследовании технологий альянса"></el-switch></p>
        <p><el-switch v-model="settings.skipWarriors" active-text="Пропустить обучение войнов"></el-switch></p>
        <p><el-switch v-model="settings.skipHospital" active-text="Пропустить лечение войск в госпитале"></el-switch></p>
    </div>
    <div class="w390 inline-block alignL vAlignT">
        <p>
            <el-tooltip placement="right" effect="light">
                <div slot="content">
                    Рекомендовано использовать всегда. Это очень выгодно
                </div>
                <el-switch v-model="settings.skipTrader" active-text="Пропустить покупку за ресуры ускорений и ресурсов у таинственной торговки"></el-switch>
            </el-tooltip>
        </p>
        <p><el-switch v-model="settings.skipScout" active-text="Пропустить исследование тумана войны"></el-switch></p>
        <p><el-switch v-model="settings.skipResourcesBuilding" active-text="Пропустить сбор ресурсов в городе"></el-switch></p>
        <p><el-switch v-model="settings.skipBarracks" active-text="Пропустить тренировку войск"></el-switch></p>
        <p>
            <el-tooltip placement="right" effect="light">
                <div slot="content">
                    Осуществляет сбор наград за задания и ежедневные задания.<br/>
                    Открывает сундуки в таверне. Собирает ежедневную награду за VIP.<br/>
                    Рекомендовано использовать всегда.
                </div>
                <el-switch v-model="settings.skipBonuses" active-text="Пропустить сбор бонусов"></el-switch>
            </el-tooltip>
        </p>
    </div>
</div>
`})
export class SettingsSwitchesPanel extends Vue {

    /** Настройки бота */
    @Prop() private readonly settings: SettingsType;

    /** Значения режимов исследований */
    private get researchModeValues() {
        return Object.values(ResearchMode);
    }

    /** Геттер получения значений режима строительства */
    private get buildModeValues() {
        return Object.values(BuildMode);
    }

    /** Геттер получения значений режима фарма */
    private get farmKindValues() {
        return Object.values(FarmKind);
    }
}