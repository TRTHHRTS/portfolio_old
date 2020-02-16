import {Request, Response} from 'express';
import TelegramBot from 'node-telegram-bot-api';
import {LOG} from "../utils/commonUtils";

/**
 * Абстрактная реализация для обработчиков telegram-ботов
 */
export abstract class AbstractTelegramBotHandler {

    /** Бот */
    public bot: TelegramBot;

    /** Префикс бота для логирования */
    protected abstract logPrefix: string;

    /**
     * Конструктор
     * @param token токен бота
     */
    protected constructor(public token: string) {
        this.token = token;
    }

    /**
     * Инициализация бота
     */
    public async init(): Promise<void> {
        try {
            this.LOG_INFO("Инициализация бота. Начало");
            this.bot = new TelegramBot(this.token);
            await this.bot.setWebHook(`${process.env.TELEGRAM_URL}/${this.token}`);
            this.bot.on('polling_error', (error) => {
                this.LOG_ERROR(`Ошибка polling_error`, error);
            });
            this.bot.on('webhook_error', (error) => {
                this.LOG_ERROR(`Ошибка webhook_error`, error);
            });
            await this.customInit();
        } catch (e) {
            this.LOG_ERROR("Ошибка инициализация бота.", e);
        } finally {
            this.LOG_INFO("Инициализация бота. Конец");
        }
    }

    /**
     * Кастомная инифиализация, должна быть переопределена в каждом боте
     */
    protected abstract async customInit(): Promise<void>;

    /** Добавить в лог запись типа INFO */
    protected LOG_INFO(message: string) {
        LOG.info(this.logPrefix + " " + message)
    }

    /** Добавить в лог запись типа ERROR */
    protected LOG_ERROR(message: string, error?: Error) {
        LOG.error(this.logPrefix + " " + message, error);
    }

    /**
     * Обработчик для вебхука
     * @param req запрос
     * @param res ответ сервера
     */
    handler(req: Request, res: Response): void {
        this.bot.processUpdate(req.body);
        res.sendStatus(200);
    }

    /**
     * Посылает сообщение клиенту
     * @param telegramId  идентификатор клиента
     * @param htmlMessage сообщение
     * @param options     опции сообщения
     */
    async sendMessageToClient(telegramId: string | number, htmlMessage: string, options: TelegramBot.SendMessageOptions = {}) {
        const parseMode: TelegramBot.SendMessageOptions = {parse_mode: "HTML"};
        await this.bot.sendMessage(telegramId, htmlMessage,options ? {...options, ...parseMode} : parseMode);
    }
}