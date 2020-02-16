import {LOG, RISEOFBOT} from "../utils/commonUtils";
import {Request, Response} from 'express';
import {sign} from "jsonwebtoken";
import {getItem, removeItem, setItem} from 'node-persist';
import {Models} from "../models";
import * as fs from "fs";
import {getDefaultSettings} from "../utils/robDefaultSettings";
import {isCommandLegal} from "../utils/commands";

// Минимальное и максимальное значение одноразового кода
const MIN_CODE_VALUE = 10000;
const MAX_CODE_VALUE = 99999;

/**
 * Посылает в Telegram одноразовый код аутентификации
 * @param req запрос
 * @param res ответ сервера
 */
export async function sendCode(req: Request, res: Response): Promise<void> {
    let telegramId;
    try {
        telegramId = <string> req.body.id;
        LOG.info(`Запрос на получение одноразового кода аутентификации [id=${telegramId}]. Начало`);
        const generatedCode = Math.floor(Math.random() * (MAX_CODE_VALUE - MIN_CODE_VALUE) + MIN_CODE_VALUE);
        const msg = "<b>Внимание!</b> Кто-то пытается зайти на страницу настроек.\n" +
            "Если вы не понимаете, о чем речь - просто удалите эту переписку.\n" +
            "Ваш код: <b>" + generatedCode + "</b>";
        await setItem(telegramId, generatedCode);
        await RISEOFBOT.sendMessageToClient(telegramId, msg);
        res.json({status: "OK", id: telegramId});
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на получение одноразового кода аутентификации [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на получение одноразового кода аутентификации [id=${telegramId}]. Конец`);
    }
}

/**
 * Проверяет одноразовый код аутентификации
 * @param req запрос
 * @param res ответ сервера
 */
export async function checkCode(req: Request, res: Response): Promise<void> {
    let telegramId;
    try {
        telegramId = <string> req.body.id;
        LOG.info(`Запрос на проверку одноразового кода аутентификации [id=${telegramId}]. Начало`);
        const code = <string> req.body.code;
        const storedCode = await getItem(telegramId);
        if (storedCode == Number(code)) {
            // создаем токен на 1 час
            const token = sign({id: telegramId}, process.env.AUTH_SECRET, {
                expiresIn: 3600
            });
            res.json({token});
        }
        await removeItem(telegramId);
        res.sendStatus(500);
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на проверку одноразового кода аутентификации [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на проверку одноразового кода аутентификации [id=${telegramId}]. Конец`);
    }
}

/**
 * Возвращает настройки бота
 * @param req запрос
 * @param res ответ сервера
 */
export async function getSettings(req: Request, res: Response): Promise<void> {
    const telegramId = <string> req.params.id;
    try {
        LOG.info(`Запрос на получение настроек бота [id=${telegramId}]. Начало`);
        let settings = await Models.ROBSettings.findByPk(telegramId);
        const defaultSettings = getDefaultSettings();
        if (!settings) {
            settings = await Models.ROBSettings.create({telegram_id: telegramId, content: JSON.stringify(defaultSettings)});
            res.json(defaultSettings);
            return;
        }
        // Мержим настройки, чтобы в случае добавления новых настроек в дефолтную конфигурацию они подтянулись для клиентов
        res.json({...defaultSettings, ...JSON.parse(settings.content)});
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на получение настроек бота [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на получение настроек бота [id=${telegramId}]. Конец`);
    }
}

/**
 * Возвращает лог работы бота
 * @param req запрос
 * @param res ответ сервера
 */
export async function getLogs(req: Request, res: Response): Promise<void> {
    const telegramId = <string> req.params.id;
    try {
        LOG.info(`Запрос на получение логов работы бота [id=${telegramId}]. Начало`);
        const count = await Models.ResendCommand.count({where: {chat_id: telegramId, name: "LOGS"}});
        const result: {[key: string]: any} = {commands: count};
        if (fs.existsSync(`./users/${telegramId}/logs/`)) {
            const logs = fs.readdirSync(`./users/${telegramId}/logs`);
            if (logs.length) {
                const lastLog = logs[logs.length - 1];
                const path = fs.realpathSync(`./users/${telegramId}/logs/${lastLog}`);
                const data = fs.readFileSync(path, 'utf8');
                LOG.debug(`Запрос на получение логов работы бота [id=${telegramId}]. Отправка логов.`);
                result.log = data;
                result.date = lastLog.split(".")[0];
                res.json(result);
                return;
            }
        }
        LOG.info(`Запрос на получение логов работы бота [id=${telegramId}]. Логов не найдено.`);
        res.json(result);
        return;
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на получение логов работы бота [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на получение логов работы бота [id=${telegramId}]. Конец`);
    }
}

/**
 * Сохраняет настройки бота клиента
 * @param req запрос
 * @param res ответ сервера
 */
export async function setSettings(req: Request, res: Response): Promise<void> {
    try {
        LOG.info(`Запрос на сохранение настроек бота [id=${(<any> req).telegramId}]. Начало`);
        const record = await Models.ROBSettings.findByPk((<any> req).telegramId);
        if (!record) {
            LOG.info(`Запрос на сохранение настроек бота [id=${(<any> req).telegramId}]. Сохранение новых настроек клиента`);
            await Models.ROBSettings.create({telegram_id: (<any> req).telegramId, content: req.body.settings});
        } else {
            LOG.info(`Запрос на сохранение настроек бота [id=${(<any> req).telegramId}]. Обновление существующих настроек клиента`);
            record.content = req.body.settings;
            await record.save();
        }
        const count = await Models.ResendCommand.count({where: {chat_id: (<any> req).telegramId, name: "RELOAD_CONFIGURATION"}});
        if (count) {
            LOG.info(`Запрос на сохранение настроек бота [id=${(<any> req).telegramId}]. Команда обновления конфигурации обнаружена, новая не добавляется`);
        } else {
            LOG.info(`Запрос на сохранение настроек бота [id=${(<any> req).telegramId}]. Добавляется команда обновления конфигурации бота`);
            await Models.ResendCommand.create({chat_id: (<any> req).telegramId, name: "RELOAD_CONFIGURATION"});
        }
        res.sendStatus(200);
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на сохранение настроек бота [id=${(<any> req).telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на сохранение настроек бота [id=${(<any> req).telegramId}]. Конец`);
    }
}

/**
 * Сохраняет изображение деревни клиента
 * @param req запрос
 * @param res ответ сервера
 */
export async function saveImage(req: Request, res: Response): Promise<void> {
    const telegramId = req.params.id;
    try {
        LOG.info(`Запрос на сохранение изображения [id=${telegramId}]. Начало`);
        const src = req.body.src;
        const buf = new Buffer(src, 'base64');
        const path = `./public_html/riseofbots/images/${telegramId}.jpg`;
        LOG.info(`Путь до изображения: ${path}`);
        if (fs.existsSync(path)) {
            LOG.info(`Изображение уже существует, удаляем предыдущее [id=${telegramId}]`);
            fs.unlinkSync(path);
        } else {
            await RISEOFBOT.sendMessageToClient(telegramId, "От бота получено изображение деревни. Перейдите в настройки на сайте, чтобы задать координаты зданий.");
        }
        fs.writeFileSync(path, buf);
        res.json({status: 0, message: `Картинка сохранена`});
    } catch (e) {
        LOG.error(`Ошибка при сохранении изображения [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на сохранение изображения [id=${telegramId}]. Конец`);
    }
}

/**
 * Сохраняет логи работы бота клиента
 * @param req запрос
 * @param res ответ сервера
 */
export async function saveLogs(req: Request, res: Response): Promise<void> {
    const telegramId = req.params.id;
    try {
        LOG.info(`Запрос на сохранение логов [id=${telegramId}]. Начало`);
        const time = new Date().getTime();
        const src = req.body.src;
        if (!fs.existsSync(`./users/${telegramId}`)){
            fs.mkdirSync(`./users/${telegramId}`);
        }
        if (!fs.existsSync(`./users/${telegramId}/logs/`)){
            fs.mkdirSync(`./users/${telegramId}/logs/`);
        }
        const logPath = `./users/${telegramId}/logs/${time}.log`;
        fs.writeFileSync(logPath, Buffer.from(src, 'base64').toString('utf8'));
        LOG.info(`Запрос на сохранение логов [id=${telegramId}]. Логи сохранены`);
        await RISEOFBOT.sendMessageToClient(telegramId, `Логи получены сервером. Вы можете посмотреть их по ссылке: http://riseofbots.trthhrts.ru/#/status`);
        res.json({status: 0, message: `Логи сохранены`});
    } catch (e) {
        LOG.error(`Ошибка при сохранении логов [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на сохранение логов [id=${telegramId}]. Конец`);
    }
}

/**
 * Добавляет в очередь команду запроса логов работы бота
 * @param req запрос
 * @param res ответ сервера
 */
export async function requestLogs(req: Request, res: Response): Promise<void> {
    try {
        LOG.info(`Запрос логов работы бота [id=${(<any> req).telegramId}]. Начало`);
        const count = await Models.ResendCommand.count({where: {chat_id: (<any> req).telegramId, name: "LOGS"}});
        if (count) {
            LOG.info(`Запрос логов работы бота [id=${(<any> req).telegramId}]. Команда запроса логов уже есть в списке, новая не добавляется`);
            await RISEOFBOT.sendMessageToClient((<any> req).telegramId, `Команда запроса логов уже была добавлена в очередь команд ранее.`);
        } else {
            LOG.info(`Запрос логов работы бота [id=${(<any> req).telegramId}]. Команда добавлена`);
            await RISEOFBOT.sendMessageToClient((<any> req).telegramId, `Логи запрошены. Получение логов займет некоторое время.`);
            await Models.ResendCommand.create({chat_id: (<any> req).telegramId, name: "LOGS"});
        }
        res.sendStatus(200);
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса логов работы бота [id=${(<any> req).telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос логов работы бота [id=${(<any> req).telegramId}]. Конец`);
    }
}

/**
 * Посылает изображение клиенту
 * @param req запрос
 * @param res ответ сервера
 */
export async function sendImageToClient(req: Request, res: Response): Promise<void> {
    const telegramId = req.params.id;
    try {
        LOG.info(`Запрос на пересылку изображения пользователю [id=${telegramId}]. Начало`);
        const imageInfo = req.body;
        const buf = new Buffer(imageInfo.src, 'base64');
        await RISEOFBOT.bot.sendPhoto(telegramId, buf, {caption: imageInfo.name});
        res.json({status: 0, message: `Картинка '${telegramId}' послана!`});
    } catch (e) {
        LOG.error(`Ошибка обработки запроса на пересылку изображения пользователю [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на пересылку изображения пользователю [id=${telegramId}]. Конец`);
    }
}

/**
 * Посылает сообщение клиенту
 * @param req запрос
 * @param res ответ сервера
 */
export async function sendMessageToClient(req: Request, res: Response): Promise<void> {
    const telegramId = req.params.id;
    try {
        LOG.info(`Запрос на пересылку сообщения пользователю [id=${telegramId}]. Начало`);
        const messageInfo = req.body;
        await RISEOFBOT.sendMessageToClient(telegramId, messageInfo.message);
        res.json({status: 0, message: `Сообщение пользователю '${telegramId}' отправлено!`});
    } catch (e) {
        LOG.error(`Ошибка обработки запроса на пересылку сообщения пользователю [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на пересылку сообщения пользователю [id=${telegramId}]. Конец`);
    }
}

/**
 * Возвращает список команд боту и удаляет их с сервера
 * @param req запрос
 * @param res ответ сервера
 */
export async function getCommands(req: Request, res: Response): Promise<void> {
    const telegramId = req.params.id;
    try {
        LOG.info(`Запрос на получение команд [id=${telegramId}]. Начало`);
        const commands = await Models.ResendCommand.findAll({where: {chat_id: telegramId}});
        const totalCommands = commands.length;
        const result = [];
        LOG.info(`Запрос на получение команд [id=${telegramId}]. Найдено ${totalCommands} команд`);
        if (totalCommands) {
            for (const item of commands) {
                result.push({name: item.name, payload: item.payload});
            }
            LOG.info(`Запрос на получение команд [id=${telegramId}]. Удаление команд с сервера`);
            for (const command of commands) {
                command.destroy();
            }
            LOG.info(`Запрос на получение команд [id=${telegramId}]. Удаление команд с сервера. Удалено ${totalCommands} команд`);
        }
        res.json(result);
    } catch (e) {
        LOG.error(`Ошибка запроса на получение команд [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на получение команд [id=${telegramId}]. Конец`);
    }
}

/**
 * Возвращает файл обновления бота
 * @param req запрос
 * @param res ответ сервера
 */
export async function getBotUpdate(req: Request, res: Response): Promise<void> {
    try {
        LOG.info(`Запрос на получение обновления бота. Начало`);
        const currentVersion = <string> req.params.version;
        const dirNames = fs.readdirSync("./bot/updates");
        if (!dirNames.length) {
            LOG.info(`На сервере отсутствуют какие-либо обновления.`);
            res.sendStatus(204);
            return;
        }
        const lastVer = dirNames[dirNames.length - 1];
        LOG.info(`Текущая версия у клиента: ${currentVersion}, последняя версия обновления: ${lastVer}`);
        if (!isNewerVersion(currentVersion, lastVer)) {
            LOG.info(`Версия клиента не меньше последней версии обновления. Обновление не требуется.`);
            res.sendStatus(204);
            return;
        }
        const path = fs.realpathSync(`./bot/updates/${lastVer}/riseOfBot.jar`);
        res.download(path, "riseOfBot.jar");
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на получения обновления бота`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на получение обновления бота. Конец`);
    }
}

/**
 * Возвращает дистрибутив для загрузки
 * @param req запрос
 * @param res ответ сервера
 */
export async function getDistributive(req: Request, res: Response): Promise<void> {
    try {
        LOG.info(`Запрос на получение дистрибутива. Начало`);
        const path = fs.realpathSync(`./bot/RObot-1.0.13.zip`);
        res.download(path, "RObot-1.0.13.zip");
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на получение дистрибутива`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на получение дистрибутива. Конец`);
    }
}

export async function addCommand(req: Request, res: Response): Promise<void> {
    const telegramId = req.params.id;
    try {
        const com = (<string> req.params.command).toUpperCase();
        LOG.info(`Запрос на добавление команды пользователю [id=${telegramId}, command=${com}]. Начало`);
        await Models.ResendCommand.create({chat_id: telegramId, name: com});
        res.sendStatus(200);
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на добавление команды пользователю [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на добавление команды пользователю [id=${telegramId}]. Конец`);
    }
}

/**
 * Проверяет новизну версии клиента
 * @param clientVer версия клиента
 * @param updateVer версия апдейта
 */
function isNewerVersion(clientVer: string, updateVer: string): boolean {
    const oldParts = clientVer.split('.');
    const newParts = updateVer.split('.');
    for (let i = 0; i < newParts.length; i++) {
        const a = ~~newParts[i];
        const b = ~~oldParts[i];
        if (a > b) return true;
        if (a < b) return false;
    }
    return false;
}