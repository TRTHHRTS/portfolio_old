import Component from "vue-class-component";
import Vue from "vue";
import {SettingsType} from "../settingsTypes";
import {Prop} from "vue-property-decorator";

@Component({
    // language=Vue
    template: `
<div>
    <el-form ref="settings" :model="settings" label-width="500px">
        <el-tooltip placement="right" effect="light">
            <div slot="content">
                Чем больше коэфициент, тем медленнее работает робот.<br/>
                Если робот не успевает выполнить какие то действий,<br/>
                потому что ПК тормозит, увеличьте коэфициент.<br/>
                <b>Рекомендуемое значение 1.7</b>
            </div>
            <el-form-item label=" Коэфициент скорости работы робота">
                <el-slider v-model="settings.lagsDelay" :min="0.5" :max="3" :step="0.1" show-input :show-input-controls="false"></el-slider>
            </el-form-item>
        </el-tooltip>
        <el-form-item label="Уровень варваров, которых будем атаковать">
            <el-input v-model="settings.barbariansMaxLvl" type="number"></el-input>
        </el-form-item>
        <el-form-item label="Уровень плиток ресурсов, которые будем собирать">
            <el-slider v-model="settings.resourceLvl" :min="2" :max="9" show-input :show-input-controls="false"></el-slider>
        </el-form-item>
        <el-tooltip placement="right" effect="light">
            <div slot="content">
                Если ресурсов меньше чем данное число,<br/>
                будут использованы бонусы из сумки.<br/>
                <b>Работа этой функции не очень стабильна.</b>
            </div>
            <el-form-item label="Мин. уровень ресурсов для использования бонусов из инвертаря">
                <el-input v-model="settings.minLimitResources" type="number"></el-input>
            </el-form-item>
        </el-tooltip>
        <el-tooltip placement="right" effect="light">
            <div slot="content">
                <b>Здесь будет описание, пока его нет.</b>
            </div>
            <el-form-item label="Шаблон войск используемый при атаке на варваров.">
                <el-slider v-model="settings.templateWarriorsToAttack" :min="0" :max="5" show-input :show-input-controls="false"></el-slider>
            </el-form-item>
        </el-tooltip>
        <el-tooltip placement="right" effect="light">
            <div slot="content">
                Рекомендовано подобрать число, время обучения которого займет около 2ух с половиной часов.<br/>
                Так будет чаще появляться таинственная торговка
            </div>
            <el-form-item label="Количество войнов для тренировки за раз">
                <el-input v-model="settings.trainingCount" type="number"></el-input>
            </el-form-item>
        </el-tooltip>
        <el-form-item label="Время, которое прячемся после нападения на наши войска (минут)">
            <el-slider v-model="settings.panicTime" :min="3" :max="120" show-input :show-input-controls="false"></el-slider>
        </el-form-item>
        <el-form-item label="Количество ОД которое оставляем после фарма варваров">
            <el-slider v-model="settings.actionPointLimitForWarMode" :min="100" :max="800" :step="50" show-input :show-input-controls="false"></el-slider>
        </el-form-item>
        <el-form-item label="Максимальное значение длительности марша для участия (минут)">
            <el-slider v-model="settings.limitRaidTime" :min="2" :max="10" show-input :show-input-controls="false"></el-slider>
        </el-form-item>
    </el-form>
</div>
`})
export class SettingsCommonPanel extends Vue {

    /** Настройки бота */
    @Prop() private readonly settings: SettingsType;
}