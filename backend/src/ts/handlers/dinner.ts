import {CommonUtils, DINNERBOT, LOG} from "../utils/commonUtils";
import {Request, Response} from 'express';
import {QueryTypes} from "sequelize";
import {Models} from "../models";
import moment = require("moment");

/**
 * Обработка запроса на получение записей
 * @param req запрос
 * @param res ответ сервера
 */
export async function getPersonalRatings(req: Request, res: Response): Promise<void> {
    const telegramId = req.params.id;
    try {
        LOG.info(`Запрос на получение записей с рейтингом [id=${telegramId}]. Начало`);
        const result = await Models.SEQ.query(
            `SELECT clear_name, AVG(price) as avgprice, AVG(r.rating) as avgrating, SUM(r.count) as orders, COUNT(eater) as ratingsCount, persrating, perscount
             FROM records r LEFT OUTER JOIN (SELECT rec.rating as persrating, rec.count as perscount, rec.eater as perseater, rec.clear_name as persclearname
                                             FROM records rec
                                             WHERE rec.eater = ${telegramId}) pers ON persclearname = r.clear_name
             GROUP BY clear_name`, {type: QueryTypes.SELECT}
        );
        res.json(result);
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на получение записей с рейтингом [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на получение записей с рейтингом [id=${telegramId}]. Конец`);
    }
}

/**
 * Обработка запроса на добавление записей
 * @param req запрос
 * @param res ответ сервера
 */
export async function setRating(req: Request, res: Response): Promise<void> {
    const telegramId = Number(req.params.id);
    let result = 0;
    try {
        LOG.info(`Запрос на добавление рейтинга [id=${telegramId}]. Начало`);
        for (const item of req.body) {
            await CommonUtils.insertRecord(telegramId, item.name, item.count, item.rating, item.price, telegramId);
            result++;
        }
        LOG.info(`Запрос на добавление рейтинга [id=${telegramId}]. Записано ${result} позиций`);
        res.send(`OK! Записано позиций: ${result}`);
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на добавление рейтинга [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на добавление рейтинга [id=${telegramId}]. Конец`);
    }
}

/**
 * Сохраняет заказ
 * @param req запрос
 * @param res ответ сервера
 */
export async function order(req: Request, res: Response): Promise<void> {
    try {
        LOG.info("Запрос на сохранение заказа. Начало");
        const item = req.body;
        if (item.telegram_id && item.order_date && item.data) {
            const foundItem = await Models.DinnerOrderModel.findOne({
                where: {
                    telegram_id: item.telegram_id,
                    order_date: item.order_date
                }
            });
            if (foundItem) {
                LOG.info("Запрос на сохранение заказа. Заказ найден, обновляем.");
                foundItem.data = item.data;
                await foundItem.save();
            } else {
                LOG.info("Запрос на сохранение заказа. Заказ не найден, создаем новый.");
                await Models.DinnerOrderModel.create({
                    telegram_id: item.telegram_id,
                    order_date: item.order_date,
                    data: item.data
                });
            }
        }
        res.json({status: 0, message: "Заказ сохранен"});
    } catch (e) {
        LOG.error("Ошибка при обработке запроса на сохранение заказа обеда", e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info("Запрос на сохранение заказа. Конец");
    }
}

/**
 * Установить "обедные" дни
 * @param req запрос
 * @param res ответ сервера
 */
export async function setDinnerDays(req: Request, res: Response): Promise<void> {
    try {
        LOG.info("Запрос на установку дней обеда. Начало");
        const days = req.body.days;
        for (const day of days) {
            const formattedDay = moment(day, "DD.MM.YYYY").format("YYYY-MM-DD");
            if (!moment(day, "DD.MM.YYYY").isValid()) {
                LOG.info(`Невалидная дата - ${day}`);
                break;
            }
            LOG.info(`Пытаемся установить день обеда ${formattedDay}`);
            if (!await Models.DinnerDayModel.findOne({where: {dinner_date: formattedDay}})) {
                LOG.info(`Добавляем новый день обеда - ${formattedDay}`);
                await Models.DinnerDayModel.create({dinner_date: formattedDay});
            } else {
                LOG.info(`Такой день - ${formattedDay} - уже установлен`);
            }
        }
        res.json({status: 0, message: "Дни обеда сохранены"});
    } catch (e) {
        LOG.error("Запрос на установку дней обеда. Ошибка", e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info("Запрос на установку дней обеда. Конец");
    }
}

/**
 * Переслать сообщение в telegram
 * @param req запрос
 * @param res ответ сервера
 */
export async function resendMessage(req: Request, res: Response): Promise<void> {
    const telegramId = req.params.id;
    try {
        LOG.info(`Запрос на пересылку сообщения о заказе [id=${telegramId}]. Начало`);
        if (!await Models.DinnerUserSettings.findOne({where: {user_id: telegramId}})) {
            LOG.info(`Указанный TelegramId (${telegramId}) не найден в списке пользователей бота, поэтому сообщение не будет отправлено`);
            res.send(`Ошибка! Сообщение не отправлено, пользователь с id=${telegramId} не найден!`);
            return;
        }
        const message = req.body.message;
        await DINNERBOT.sendMessageToClient(telegramId, message);
        res.send(`OK! сообщение успешно переслано клиенту с id=${telegramId}`);
    } catch (e) {
        LOG.error(`Ошибка при обработке запроса на пересылку сообщения о заказе [id=${telegramId}]`, e);
        res.sendStatus(500).json({error: e.message});
    } finally {
        LOG.info(`Запрос на пересылку сообщения о заказе [id=${telegramId}]. Конец`);
    }
}