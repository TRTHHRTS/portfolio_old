import Component from "vue-class-component";
import Vue from "vue";
import {Prop} from "vue-property-decorator";
import {BUILDING_NAMES, CoordKey, CurrentCoords, SettingsType} from "../settingsTypes";

@Component({
    // language=Vue
    template: `
<div>
    <el-row class="mb10 alignC">
        <el-col :span="6" v-for="(coord, index) in coordsKeys" :key="index">
            <el-card class="m10">
                <div>{{getBuildingName(coord)}}</div>
                <img :src="imageUrl" class="image" width="100px">
                <div>Координаты: [x = {{settings.coords[coord].x}}, y = {{settings.coords[coord].y}}]</div>
                <div class="bottom mb10 mt10">
                    <el-button class="button" size="mini" type="success" plain round @click="setCoords(coord)" >Задать</el-button>
                </div>
            </el-card>
        </el-col>
    </el-row>
    <el-dialog :title="'Задайте координаты для здания ' + getBuildingName(currentCoords.name)" :visible.sync="setCoordDialogVisible" width="90%" center>
        <div class="alignC">
            <canvas ref="canvasImage" width="1280" height="720" class="crosshair" @mousemove="mouseOverImage" @click="changeCoords"></canvas>
        </div>
        <div class="alignC"><b>[X = {{currentCoords.x}}, Y = {{currentCoords.y}}]</b></div>
    </el-dialog>
</div>
`})
export class SettingsCoordinatesPanel extends Vue {

    /** Настройки бота */
    @Prop() private readonly settings: SettingsType;

    private currentCoords: CurrentCoords = {
        name: "",
        key: <any> null,
        x: 0,
        y: 0,
    };

    private interval: any = null;

    private setCoordDialogVisible = false;

    private get coordsKeys(): CoordKey[] {
        return <CoordKey[]> Object.keys(this.settings.coords);
    }

    private get imageUrl() {
        const id = this.$cookies.get("telegramId");
        return `/images/${id}.jpg?${new Date().getTime()}`;
    }

    private getBuildingName(key: CoordKey) {
        return BUILDING_NAMES[key];
    }

    private getCanvasCtx() {
        var myCanvas = (<any>this.$refs['canvasImage']);
        return myCanvas.getContext('2d');
    }

    private getImage() {
        const img = new Image;
        img.src = this.imageUrl;
        return img;
    }

    private async setCoords(coordKey: CoordKey) {
        clearInterval(this.interval);
        this.setCoordDialogVisible = true;
        await this.$nextTick();
        let counter = 5;
        const ctx = this.getCanvasCtx();
        const image = this.getImage();
        ctx.drawImage(image, 0, 0);
        image.onload = () => {
            this.interval = setInterval(() => {
                ctx.beginPath();
                ctx.lineWidth = 20 - counter;
                ctx.strokeStyle = "#FF000F";
                ctx.arc(
                    this.settings.coords[this.currentCoords.key].x,
                    this.settings.coords[this.currentCoords.key].y,
                    counter++, 0, Math.PI * 2, true);

                ctx.fillStyle = "#00FF40";
                ctx.fill();
                ctx.stroke();
                if (counter > 20) {
                    counter = 5;
                }
            }, 30)
        };

        this.currentCoords = {
            name: coordKey,
            key: coordKey,
            x: (<any>this.settings).coords[coordKey].x,
            y: (<any>this.settings).coords[coordKey].y
        };
    }

    private async changeCoords(event: MouseEvent) {
        const ctx = this.getCanvasCtx();
        const image = this.getImage();
        ctx.drawImage(image, 0, 0);
        this.settings.coords[this.currentCoords.key].x = event.offsetX < 0 ? 0 : event.offsetX;
        this.settings.coords[this.currentCoords.key].y = event.offsetY < 0 ? 0 : event.offsetY;
        setTimeout(() => {
            clearInterval(this.interval);
            this.setCoordDialogVisible = false;
        }, 1000);
        this.$emit("onCoordsChange");
    }

    private mouseOverImage(event: MouseEvent) {
        this.currentCoords.x = event.offsetX < 0 ? 0 : event.offsetX;
        this.currentCoords.y = event.offsetY < 0 ? 0 : event.offsetY;
    }
}