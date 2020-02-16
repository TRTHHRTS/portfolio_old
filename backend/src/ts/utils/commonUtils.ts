import moment from 'moment';
import {DinnerBotHandler} from "../telegram_bots/dinnerBotHandler";
import {RiseOfBotHandler} from "../telegram_bots/riseOfBotHandler";
import {Models} from "../models";
import {FileLogger} from "./fileLogger";
import dotenv from "dotenv";

dotenv.config();

/** Логгер для приложения */
export const LOG = new FileLogger();
/** Бот обедов*/
export const DINNERBOT = new DinnerBotHandler();
/** Бот для игры в Rise of Kindoms */
export const RISEOFBOT = new RiseOfBotHandler();

/**
 * Утилитный класс
 */
export class CommonUtils {

    static formatDate(date = new Date()) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }

    static todayDate() {
        return moment(new Date()).format('DD.MM.YYYY');
    }

    static currentHour() {
        return moment(new Date()).format('HH');
    }

    private static clearTrash(text: string, clearDescr = true, clearGrams = true, clearSymbols = true): string {
        let finalResult = text.toLowerCase();
        let indexTrash = finalResult.indexOf("(");
        if (clearDescr && indexTrash != -1) {
            finalResult = finalResult.substring(0, indexTrash);
        }
        indexTrash = finalResult.indexOf("в100гр");
        if (clearGrams && indexTrash != -1) {
            finalResult = finalResult.substring(0, indexTrash);
        }
        indexTrash = finalResult.indexOf("в 100гр");
        if (clearGrams && indexTrash != -1) {
            finalResult = finalResult.substring(0, indexTrash);
        }
        return clearSymbols ? finalResult.replace(/[^абвгдеёжзийклмнопрстуфхцчшщъыьэюя]/g, "") : finalResult;
    }

    /**
     * Добавляет запись о блюде
     * @param eater  идентификатор пользователя
     * @param name   наименование блюда
     * @param count  количество заказанного
     * @param rating рейтинг
     * @param price  цена блюда
     * @param chatId идентификатор чата
     */
    static async insertRecord(eater: number, name: string, count: string | number, rating: string | number, price: string, chatId: number = null): Promise<void> {
        const clearName = CommonUtils.clearTrash(name);
        const existingRecord = await Models.DinnerRecord.findOne({where: {clear_name: clearName, eater: eater}});
        if (existingRecord) {
            existingRecord.update({name, count: Number(existingRecord.count) + Number(count), rating: rating ? Number(rating) : existingRecord.rating});
        } else {
            await Models.DinnerRecord.create({eater: eater, chat_id: chatId, name, clear_name: clearName, count: Number(count), price, rating: rating ? Number(rating) : 5});
        }
    }
}