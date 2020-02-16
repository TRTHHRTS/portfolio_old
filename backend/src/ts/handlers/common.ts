import {Request, Response} from 'express';
import {LOG} from "../utils/commonUtils";

/**
 * Возвращает текущее время сервера
 * @param req запрос
 * @param res ответ сервера
 */
export function getTime(req: Request, res: Response): void {
    try {
        LOG.info("Получение серверного времени. Начало.");
        res.json({time: new Date().getTime()});
    } catch (e) {
        LOG.error("Ошибка получения серверного времени", e);
        res.sendStatus(500);
    } finally {
        LOG.info("Получение серверного времени. Конец.");
    }
}