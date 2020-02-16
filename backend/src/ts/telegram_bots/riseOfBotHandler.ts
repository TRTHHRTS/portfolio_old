import {AbstractTelegramBotHandler} from "./abstractTelegramBotHandler";
import TelegramBot, {EditMessageTextOptions} from 'node-telegram-bot-api';
import {Models, ROBSettingsModel} from "../models";
import {isCommandLegal} from "../utils/commands";
import {i18n} from "../app";
import {getDefaultSettings} from "../utils/robDefaultSettings";

/**
 * Обработчик для бота RiseOfBot
 */
export class RiseOfBotHandler extends AbstractTelegramBotHandler {

    /** Префикс бота для логирования */
    protected logPrefix = "[RiseOfBot]";

    /** Структура кнопок выбора локали */
    private lang_options = {
        reply_markup: {
            inline_keyboard: [[
                { text: 'Русский', callback_data: 'ru' },
                { text: 'English', callback_data: 'en' }
            ]]
        }
    };

    /** Конструктор */
    constructor() {
        super(process.env.RISEOFBOT_TOKEN);
    }

    /** Иницализация бота */
    protected async customInit(): Promise<void> {
        try {
            this.LOG_INFO("Инициализация бота. Установка слушателей различных событий. Начало");
            this.bot.onText(/.+/, async (info) => {
                const model = <ROBSettingsModel> await Models.ROBSettings.findByPk(info.from.id);
                if (model) {
                    const settings = JSON.parse(model.content);
                    if (settings.lang) {
                        i18n.setLocale(settings.lang);
                    }
                }
            });
            this.bot.onText(/\/start/i, async (info) => {
                try {
                    this.LOG_INFO(`Обработка команды /start [id=${info.from.id}]. Начало`);
                    const model = <ROBSettingsModel>await Models.ROBSettings.findByPk(info.from.id);
                    if (model) {
                        const settings = JSON.parse(model.content);
                        if (settings.lang) {
                            i18n.setLocale(settings.lang);
                            await this.sendMessageToClient(info.from.id, i18n.__("start"), this.getStartMessageButtons(info.from.id));
                            return;
                        }
                    }
                    await this.sendMessageToClient(info.from.id, "Выберите язык (Choose a language):", this.lang_options);
                } catch (e) {
                    this.LOG_ERROR(`Ошибка при обработке команды /start [id=${info.from.id}]`, e);
                } finally {
                    this.LOG_INFO(`Обработка команды /start [id=${info.from.id}]. Конец`);
                }
            });
            this.bot.onText(/\/.+/i, async (info, match) => { await this.botOnCommand(info); });
            this.bot.on('callback_query',  async (info) => { await this.botOnCallback(info); });
        } catch (e) {
            this.LOG_ERROR(`Ошибка при установке слушателей различных событий`, e);
        } finally {
            this.LOG_INFO("Инициализация бота. Установка слушателей различных событий. Конец");
        }
    }

    /**
     * Обработчик обратной связи от пользователя
     * @param info callback-сообщение от Telegram
     */
    private async botOnCallback(info: TelegramBot.CallbackQuery): Promise<void> {
        const match = /com_ap_(\d{1,2}$)/.exec(info.data);
        const telegramId = info.from.id;
        const messageOptions = {chat_id: telegramId, message_id: info.message.message_id};
        try {
            this.LOG_INFO(`Обработка callback-команды '${info.data}' [id=${telegramId}]. Начало`);
            if (match) {
                await this.queueCommand(telegramId, `/AP ${match[1]}`);
                await this.sendMessageToClient(telegramId, i18n.__("command_added"), this.getYesNoButtons());
                return;
            }
            switch (info.data) {
                case "start":
                    await this.bot.editMessageText(i18n.__("start"), {...messageOptions, ...this.getStartMessageButtons(telegramId)});
                    break;
                case "get_id":
                    await this.bot.editMessageText(`ID: ${telegramId}`, {...messageOptions, ...this.getBackButton()});
                    break;
                case "ru":
                    await this.changeLocaleCommand(telegramId, messageOptions, "ru");
                    break;
                case "en":
                    await this.changeLocaleCommand(telegramId, messageOptions, "en");
                    break;
                case "help":
                    await this.bot.editMessageText(i18n.__("help"), {...messageOptions, ...this.getHelpMessageButtons()});
                    break;
                case "commands":
                    await this.bot.editMessageText(i18n.__("commands_title"), {...messageOptions, ...this.getCommandsButtons()});
                    break;
                case "com_launch":
                    await this.queueCommand(telegramId, "/LAUNCH");
                    await this.sendMessageToClient(telegramId, i18n.__("command_added"), this.getYesNoButtons());
                    break;
                case "com_stop":
                    await this.queueCommand(telegramId, "/STOP");
                    await this.sendMessageToClient(telegramId, i18n.__("command_added"), this.getYesNoButtons());
                    break;
                case "com_ap":
                    await this.bot.editMessageText(i18n.__("ap_choose"), {...messageOptions, ...this.getAPMessageButtons()});
                    break;
                case "com_logs":
                    await this.queueCommand(telegramId, "/LOGS");
                    await this.sendMessageToClient(telegramId, i18n.__("command_added"), this.getYesNoButtons());
                    break;
                case "com_screen":
                    await this.queueCommand(telegramId, "/SCREEN");
                    await this.sendMessageToClient(telegramId, i18n.__("command_added"), this.getYesNoButtons());
                    break;
                case "choose_lang":
                    await this.bot.editMessageText("Выберите язык (Choose a language):", {...messageOptions, ...this.lang_options});
                    break;
                case "queue_commands":
                    try {
                        const commands = <{ name: string }[]>await Models.ResendCommand.findAll({where: {chat_id: telegramId}});
                        await this.bot.editMessageText(i18n.__("queue_title") + JSON.stringify((commands && commands.map(i => i.name)) || []), {...messageOptions, ...this.getBackButton()});
                    } catch (e) {
                        this.LOG_ERROR("Ошибка получения команд пользователя", e);
                        await this.bot.editMessageText(i18n.__("error_internal"), {...messageOptions, ...this.getBackButton()});
                    }
                    break;
                case "feedback":
                    this.LOG_INFO(`Пользователь хочет сделать обратную связь [id=${telegramId}]`);
                    const mes = await this.bot.sendMessage(telegramId, i18n.__("feedback_info"));
                    const replyListenerId = await this.bot.onReplyToMessage(telegramId, mes.message_id, async (msg) => {
                        this.LOG_INFO(`Пользователь написал обратную связь, сохраняем [id=${telegramId}]. Начало`);
                        try {
                            const [model, created] = await Models.ROBFeedback.findOrCreate({
                                where: {telegram_id: msg.from.id},
                                defaults: {telegram_id: msg.from.id, text: msg.text}
                            });
                            if (!created) {
                                this.LOG_INFO(`Пользователь написал обратную связь, дополняем отзыв [id=${telegramId}]. Начало`);
                                await model.update({
                                    text: model.text + " " + msg.text,
                                    created_at: new Date().getTime()
                                });
                            }
                            await this.sendMessageToClient(telegramId, "Ок, сохранили", this.getBackButton());
                        } catch (e) {
                            this.LOG_ERROR(`Пользователь написал обратную связь, но ошибка [id=${telegramId}]`, e);
                        } finally {
                            this.LOG_INFO(`Пользователь написал обратную связь [id=${telegramId}]. Конец`);
                        }
                    });
                    break;
                default:
                    await this.sendMessageToClient(telegramId, "Выберите язык (Choose a language):", this.lang_options);
            }
        } catch (e) {
            this.LOG_ERROR(`Ошибка при обработке callback-команды '${info.data}' [id=${telegramId}]`, e)
        } finally {
            this.LOG_INFO(`Обработка callback-команды '${info.data}' [id=${telegramId}]. Конец`);
        }
    }

    /**
     * Команда смены локали
     * @param telegramId     идентификатор пользователя
     * @param messageOptions опции редактирования сообщения
     * @param lang           язык локали
     */
    private async changeLocaleCommand(telegramId: number, messageOptions: EditMessageTextOptions, lang: string) {
        i18n.setLocale(lang);

        const settings = <ROBSettingsModel> await Models.ROBSettings.findByPk(telegramId);
        const defaultSettings = getDefaultSettings(lang);
        if (!settings) {
            await Models.ROBSettings.create({telegram_id: telegramId, content: JSON.stringify(defaultSettings)});
        } else {
            const actualSettings = JSON.parse(settings.content);
            actualSettings.lang = lang;
            settings.content = JSON.stringify(actualSettings);
            settings.save();
        }
        await this.bot.editMessageText(i18n.__("start"), {...messageOptions, ...this.getStartMessageButtons(telegramId)});
    }

    /**
     * Обработка входящего сообщения от пользователя бота
     * @param info сообщение пользователя
     */
    private async botOnCommand(info: TelegramBot.Message): Promise<void> {
        let text = info.text.trim().toUpperCase();
        const fromId = info.from.id;
        try {
            if (text === "/START") {
                return;
            }
            this.LOG_INFO(`Начало обработки команды [id=${fromId}]: "${text}"`);
            // Переводим в верхний регистр для удобства
            await this.queueCommand(fromId, text);
            return;
        } catch (e) {
            this.LOG_ERROR(`Ошибка обработки команды [id=${fromId}]`, e);
        } finally {
            if (text !== "/START") {
                this.LOG_INFO(`Конец обработки команды [id=${fromId}]`);
            }
        }
    }

    /**
     * Добавляет команду в очередь
     * @param telegramId идентификатор пользователя
     * @param text       текст команды
     */
    private async queueCommand(telegramId: number, text: string) {
        try {
            this.LOG_INFO(`Добавление команды в очередь [id=${telegramId}]. Начало`);
            const splitedText = text.split(" ");
            const payload = splitedText.length > 1 ? splitedText.splice(1).join(" ") : null;
            const name = splitedText[0].substring(1).toUpperCase();
            if (!isCommandLegal(name)) {
                this.LOG_INFO(`Пользователь хотел добавить нелегальную команду [id=${telegramId}]: ${JSON.stringify(name)}`);
                await this.sendMessageToClient(telegramId, i18n.__("error_unknown_command") + ` ['${name}']`);
                return;
            }
            // TODO камонду запроса логов сделать "уникальной"
            await Models.ResendCommand.create({
                chat_id: telegramId,
                name,
                payload
            });
            await this.sendMessageToClient(telegramId, `Команда добавлена в очередь. (${JSON.stringify(name)})`);
        } catch (e) {
            this.LOG_ERROR(`Ошибка добавления команды в очередь [id=${telegramId}]`, e);
            await this.sendMessageToClient(telegramId, i18n.__("error_command"));
        } finally {
            this.LOG_INFO(`Добавление команды в очередь [id=${telegramId}]. Конец`);
        }
    }

    /**
     * Возвращает структуру кнопок стартового сообщения
     * @return структура кнопок для бота
     */
    private getStartMessageButtons(telegramId: number) {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{ text: i18n.__("instruction"), url: "https://riseofbots.trthhrts.ru/#/help" }],
                    [{ text: i18n.__("download_memu"), url: "https://www.memuplay.com/" }],
                    [{ text: i18n.__("download_dist"), url: "http://trthhrts.ru/rob/distributive" }],
                    [
                        { text: i18n.__("settings_btn"), url: `http://riseofbots.trthhrts.ru/#/auth/${telegramId}` },
                        { text: i18n.__("feedback_btn"), callback_data: 'feedback' }
                    ],
                    [{ text: i18n.__("get_id_btn"), callback_data: 'get_id' }],
                    [
                        { text: i18n.__("help_btn"), callback_data: 'help' },
                        { text: i18n.__("lang_btn"), callback_data: 'choose_lang' },
                    ],
                    [{ text: i18n.__("commands_btn"), callback_data: 'commands' }],
                    [{ text: i18n.__("queue_commands_btn"), callback_data: 'queue_commands' }]
                ]
            }
        };
    }

    /**
     * Возвращает структуру кнопок комманд управления Java-ботом
     * @return структура кнопок для бота
     */
    private getCommandsButtons() {
        return {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: i18n.__("cn_launch"), callback_data: 'com_launch' },
                        { text: i18n.__("cn_stop"), callback_data: 'com_stop' }
                    ],
                    [
                        { text: i18n.__("cn_screen"), callback_data: 'com_screen' },
                        { text: i18n.__("cn_ap"), callback_data: 'com_ap' }
                    ],
                    [
                        { text: i18n.__("cn_logs"), callback_data: 'com_logs' }
                    ],
                    [
                        { text: i18n.__("back"), callback_data: 'start' }
                    ]
                ]
            }
        };
    }

    /**
     * Получить кнопку Назад
     */
    private getBackButton() {
        return {
            reply_markup: {
                inline_keyboard: [[{text: i18n.__("back"), callback_data: 'start'}]]
            }
        }
    }

    /**
     * Возвращает структуру кнопок сообщения помощи
     * @return структура кнопок для бота
     */
    private getHelpMessageButtons() {
        return {
            reply_markup: {
                inline_keyboard: [
                    [{ text: i18n.__("more"), url: "https://riseofbots.trthhrts.ru/#/help" }],
                    [{ text: i18n.__("back"), callback_data: "start" }],
                ]
            }
        };
    }

    private getYesNoButtons() {
        return {
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: i18n.__("yes"), callback_data: "commands"},
                        {text: i18n.__("no"), callback_data: "start"}
                    ]
                ]
            }
        };
    }

    /**
     * Возвращает структуру кнопок сообщения помощи
     * @return структура кнопок для бота
     */
    private getAPMessageButtons() {
        return {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "1", callback_data: "com_ap_1" },
                        { text: "2", callback_data: "com_ap_2" },
                        { text: "3", callback_data: "com_ap_3" },
                        { text: "4", callback_data: "com_ap_4" },
                        { text: "5", callback_data: "com_ap_5" }
                    ],
                    [
                        { text: "6", callback_data: "com_ap_6" },
                        { text: "7", callback_data: "com_ap_7" },
                        { text: "8", callback_data: "com_ap_8" },
                        { text: "9", callback_data: "com_ap_9" },
                        { text: "10", callback_data: "com_ap_10" }
                    ],
                    [{ text: i18n.__("back"), callback_data: "start" }]
                ]
            }
        };
    }
}