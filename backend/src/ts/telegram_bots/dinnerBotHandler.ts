import {AbstractTelegramBotHandler} from "./abstractTelegramBotHandler";
import TelegramBot from 'node-telegram-bot-api';
import {Op} from "sequelize";
import {DinnerUserModel, Models} from "../models";
import {CommonUtils} from "../utils/commonUtils";
import moment from "moment";

/**
 * Обработчик для Telegram-бота заказа обедов
 */
export class DinnerBotHandler extends AbstractTelegramBotHandler {

    protected logPrefix = "[DinnerBot]";

    /**
     * Конструктор
     */
    constructor() {
        super(process.env.DINNER_BOT_TOKEN);
    }

    /**
     * Кастомная инициализация обработчика
     */
    protected async customInit(): Promise<void> {
        try {
            this.LOG_INFO("Инициализация бота. Установка слушателей различных событий. Начало");
            this.bot.onText(/\/start/i, async (info) => {
                try {
                    this.LOG_INFO(`Обработка команды /start [id=${info.from.id}]. Начало`);
                    await this.newUser(info.from.id, info.chat.id);
                    await this.sendMessageToClient(info.from.id, "Чем я могу вам помочь?", DinnerBotHandler.getStartMessageButtons());
                } catch (e) {
                    this.LOG_ERROR(`Ошибка при обработке команды /start [id=${info.from.id}]`, e);
                } finally {
                    this.LOG_INFO(`Обработка команды /start [id=${info.from.id}]. Конец`);
                }
            });
            this.bot.on('callback_query',  async (info) => { await this.botOnCallback(info); });
            // TODO Это необходимо?
            await Models.DinnerRecord.sync();
        } catch (e) {
            this.LOG_ERROR("Ошибка инициализация бота.", e);
        } finally {
            this.LOG_INFO("Инициализация бота. Установка слушателей различных событий. Конец");
        }
    }

    private async showAll(text: string, chatId: number, clientId: number) {
        const result = await Models.DinnerRecord.findAll({where: {eater: clientId}, raw: true});
        const resultMessage: string[] = [];
        if (!result) {
            await this.sendMessageToClient(clientId, "В базе пусто");
        }
        for (let record of result) {
            resultMessage.push(`${record.name} заказано <b>${record.count}</b> раз (${record.price}р.)\n`);
        }
        let message = "";
        let counter = 0;
        for (const item of resultMessage) {
            message += item;
            if (counter >= 10) {
                await this.sendMessageToClient(chatId, message);
                counter = 0;
                message = "";
            } else {
                counter++;
            }
        }
    }

    private async showExact(text: string[], chatId: number, clientId: number) {
        text.shift();
        const nameOpt = {[Op.like]: `%${text.join(" ").toLowerCase()}%`};
        const found = await Models.DinnerRecord.findAll({where: {eater: clientId, name: nameOpt}});
        let result = ``;
        this.LOG_INFO(JSON.stringify(found));
        for (let item of found) {
            const arr: string[] = [item.name];
            arr.push(item.count + " раз");
            if (item.rating) {
                arr.push("рейтинг " + item.rating);
            }
            const avgRating = await Models.DinnerRecord.sum("rating", {where: {name: item.name}}) / await Models.DinnerRecord.count({where: {name: item.name}});
            if (avgRating) {
                arr.push("общий " + avgRating);
            }
            result += arr.join(", ") + "\n";
        }
        await this.sendMessageToClient(chatId, result || "Не найдено.");
    }

    private async createNewRecords(textArray: string[], chatId: number, clientId: number) {
        try {
            const count = Number(textArray.shift());
            const price = textArray.shift();
            const lastItem = textArray.pop();
            let rating = isNaN(Number(lastItem)) ? null : Number(lastItem);
            if (rating === null) {
                textArray.push(lastItem);
            } else {
                if (rating < 0 || rating > 10) {
                    await this.sendMessageToClient(chatId, "НЕ СОХРАНЕНО. Рейтинг возможен от 0 до 10 включительно.");
                    return;
                }
            }
            const name = textArray.join(" ").toLowerCase();
            if (!count || count === 0 || !price || !name) {
                await this.sendMessageToClient(chatId, "НЕ СОХРАНЕНО. Некорректная строка.");
                return;
            }
            await CommonUtils.insertRecord(clientId, name, count, rating ? rating : 5, price, chatId);
            return 1;
        } catch (e) {
            return 0;
        }
    }

    /**
     * Обработчик обратной связи от пользователя
     * @param info callback-сообщение от Telegram
     */
    private async botOnCallback(info: TelegramBot.CallbackQuery): Promise<void> {
        const telegramId = info.from.id;
        const messageOptions = {chat_id: telegramId, message_id: info.message.message_id};
        try {
            this.LOG_INFO(`Обработка callback-команды '${info.data}' [id=${telegramId}]. Начало`);
            switch (info.data) {
                case "start":
                    await this.bot.editMessageText("Чем я могу вам помочь?", {...messageOptions, ...DinnerBotHandler.getStartMessageButtons()});
                    break;
                case "get_id":
                    if (!await Models.DinnerUserSettings.findOne({where: {user_id: telegramId}})) {
                        await this.newUser(telegramId, telegramId);
                    }
                    await this.sendMessageToClient(telegramId, `Ваш ID (никому не сообщайте!): <b>${telegramId}</b>`);
                    break;
                case "today_order":
                    const todayOrder = await Models.DinnerOrderModel.findOne({where: {telegram_id: telegramId, order_date: CommonUtils.todayDate()}});
                    let message = "На сегодня вашего заказа не нашлось, попробуйте зайти на страницу обедов";
                    if (todayOrder) {
                        message = `<b>Заказ на сегодня (${todayOrder.order_date}):</b>\n${todayOrder.data}`;
                    }
                    await this.sendMessageToClient(telegramId, message);
                    break;
                case "orders_history":
                    const orders = await Models.DinnerOrderModel.findAll({where: {telegram_id: telegramId}, limit: 5, order: [['id', 'DESC']]});
                    let messageOrders = "Не найдено ни одного заказа.";
                    if (orders) {
                        messageOrders = "";
                        for(let ord of orders) {
                            messageOrders += `<b>Заказ на ${ord.order_date}:</b>\n${ord.data}\n`;
                        }
                    }
                    await this.sendMessageToClient(telegramId, messageOrders);
                    break;
                case "notify_09":
                case "notify_10":
                case "notify_11":
                    const notifyHour = info.data.substring(info.data.lastIndexOf("_") + 1);
                    const userToOn = await Models.DinnerUserSettings.findOne({where: {user_id: telegramId}});
                    if (userToOn) {
                        userToOn.need_notify = true;
                        userToOn.when_notify = notifyHour;
                        await userToOn.save();
                        this.LOG_INFO(`Для пользователя ${telegramId} включено напоминание на ${notifyHour}:00`);
                        await this.bot.editMessageText("Ок, постараюсь напомнить", {...messageOptions, ...DinnerBotHandler.getStartMessageButtons()});
                    } else {
                        this.LOG_INFO(`Не найден профиль пользователя ${telegramId}`);
                    }
                    break;
                case "order_notify_09":
                case "order_notify_10":
                case "order_notify_11":
                    const orderNotifyHour = info.data.substring(info.data.lastIndexOf("_") + 1);
                    const userToOrderNotifyOn = await Models.DinnerUserSettings.findOne({where: {user_id: telegramId}});
                    if (userToOrderNotifyOn) {
                        userToOrderNotifyOn.need_order_notify = true;
                        userToOrderNotifyOn.when_order_notify = orderNotifyHour;
                        await userToOrderNotifyOn.save();
                        this.LOG_INFO(`Для пользователя ${telegramId} включено напоминание о заказанном обеде на ${orderNotifyHour}:00`);
                        await this.bot.editMessageText(`Ок, буду присылать тебе твой заказ, в ${orderNotifyHour}:00`, {...messageOptions, ...DinnerBotHandler.getStartMessageButtons()});
                    } else {
                        this.LOG_INFO(`Не найден профиль пользователя ${telegramId}`);
                    }
                    break;
                case "order_notifying":
                    await this.bot.editMessageText("Во сколько вам присылать ваш заказ?", {...messageOptions, ...DinnerBotHandler.getOrderNotifyTimesButtons()});
                    break;
                case "order_notify_off":
                    const userToOrderNotifyOff = await Models.DinnerUserSettings.findOne({where: {user_id: telegramId}});
                    if (userToOrderNotifyOff) {
                        userToOrderNotifyOff.need_order_notify = false;
                        await userToOrderNotifyOff.save();
                        this.LOG_INFO(`Для пользователя ${telegramId} посылка заказа по крон-задаче отключена`);
                        await this.bot.editMessageText("Ок, больше не буду присылать вам ваш заказ", {...messageOptions, ...DinnerBotHandler.getStartMessageButtons()});
                    } else {
                        this.LOG_INFO(`Не найден профиль пользователя ${telegramId}`);
                    }
                    break;
                case "remembering_off":
                    const userToOff = await Models.DinnerUserSettings.findOne({where: {user_id: telegramId}});
                    if (userToOff) {
                        userToOff.need_notify = false;
                        await userToOff.save();
                        this.LOG_INFO(`Для пользователя ${telegramId} напоминание отключено`);
                        await this.bot.editMessageText("Ок, больше не побеспокою", {...messageOptions, ...DinnerBotHandler.getStartMessageButtons()});
                    } else {
                        this.LOG_INFO(`Не найден профиль пользователя ${telegramId}`);
                    }
                    break;
                case "remembering":
                    await this.bot.editMessageText("Во сколько вам напомнить, что надо сделать заказ?", {...messageOptions, ...DinnerBotHandler.getNotifyTimesButtons()});
                    break;
                case "no_notify_today":
                    const curDay = moment(new Date()).format('YYYY-MM-DD');
                    const noNotifyDay = await Models.DinnerNoNotifyModel.findOne({where: {user_id: telegramId, day: curDay}});
                    let noNotifyMessage = 'Напоминание на этот день уже отключено вами';
                    if (!noNotifyDay) {
                        await Models.DinnerNoNotifyModel.create(
                            {
                                user_id: telegramId,
                                day: curDay
                            });
                        noNotifyMessage = 'Сегодня напоминаний больше не будет';
                    }
                    await this.sendMessageToClient(info.from.id, noNotifyMessage);
                    break;
                default:
                    await this.sendMessageToClient(info.from.id, "Чем я могу вам помочь?", DinnerBotHandler.getStartMessageButtons());
            }
        } catch (e) {
            this.LOG_ERROR(`Ошибка при обработке callback-команды '${info.data}' [id=${telegramId}]`, e)
        } finally {
            this.LOG_INFO(`Обработка callback-команды '${info.data}' [id=${telegramId}]. Конец`);
        }
    }

    private async newUser(clientId: number, chatId: number) {
        try {
            this.LOG_INFO(`Создание профиля нового пользователя [id=${clientId}]. Начало`);
            const user = await Models.DinnerUserSettings.findOne({where: {user_id: clientId}}) as DinnerUserModel;
            if (!user) {
                await Models.DinnerUserSettings.create(
                    {
                        user_id: clientId,
                        chat_id: chatId,
                        need_notify: false,
                        when_notify: null,
                        admin_rights: false
                    });
                await this.sendMessageToClient(chatId, "Создан профиль нового пользователя");
                this.LOG_INFO(`Создание профиля нового пользователя [id=${clientId}]. Профиль создан`);
            } else {
                this.LOG_INFO(`Создание профиля нового пользователя [id=${clientId}]. Профиль уже существует`);
            }

        } catch (e) {
            this.LOG_ERROR(`Ошибка при создании профиля нового пользователя [id=${clientId}]`, e);
        } finally {
            this.LOG_INFO(`Создание профиля нового пользователя [id=${clientId}]. Конец`);
        }
    }

    /**
     * Возвращает структуру кнопок напоминания
     * @return структура кнопок для бота
     */
    private static getStartMessageButtons(): TelegramBot.EditMessageTextOptions {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Заказать обед", url: process.env.DINNER_ORDER_URL }],
                    [{ text: "Получить ID", callback_data: 'get_id' }],
                    [
                        { text: "Заказ на сегодня", callback_data: 'today_order' },
                        { text: "Мои заказы", callback_data: 'orders_history' }
                    ],
                    [
                        { text: "Напоминание", callback_data: 'remembering' },
                        { text: "Присылать заказ", callback_data: 'order_notifying' }
                    ]
                ]
            }
        };
    }

    /**
     * Возвращает структуру кнопок управления посылкой заказа
     */
    private static getOrderNotifyTimesButtons(): TelegramBot.EditMessageTextOptions {
        return {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "09:00", callback_data: 'order_notify_09' },
                        { text: "10:00", callback_data: 'order_notify_10' },
                        { text: "11:00", callback_data: 'order_notify_11' },
                    ],
                    [
                        { text: "Выключить", callback_data: 'order_notify_off' },
                        { text: "Отмена", callback_data: 'start' }
                    ]
                ]
            }
        };
    }

    /**
     * Возвращает структуру кнопок для напоминания о заказе обеда
     */
    private static getNotifyTimesButtons(): TelegramBot.EditMessageTextOptions {
        return {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "09:00", callback_data: 'notify_09' },
                        { text: "10:00", callback_data: 'notify_10' },
                        { text: "11:00", callback_data: 'notify_11' },
                    ],
                    [
                        { text: "Выключить", callback_data: 'remembering_off' },
                        { text: "Отмена", callback_data: 'start' }
                        ]
                ]
            }
        };
    }

    static getNotifyMessageButtons(): TelegramBot.EditMessageTextOptions {
        return {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Не напоминать сегодня", callback_data: 'no_notify_today' },
                        { text: "Заказать сейчас", url: process.env.DINNER_ORDER_URL }
                    ]
                ]
            }
        };
    }
}