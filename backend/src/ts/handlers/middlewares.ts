import {verify, VerifyErrors} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express-serve-static-core";

/**
 * Проверка аутентификации клиента
 * @param req  запрос
 * @param res  ответ сервера
 * @param next обработчик перехода
 */
export function verifyToken(req: Request, res: Response, next: NextFunction) {
    // Получаем токен из заголовка
    const token = <string> req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send("No token");
    }
    // Проверяем токен на актуальность
    verify(token, process.env.AUTH_SECRET, (err: VerifyErrors, decoded: DecodedType) => {
        if (err) {
            return res.status(401).send("Bad token");
        }
        // Кладем в запрос telegramId, используем дальше по своему усмотрению
        (<any> req).telegramId = decoded.id;
        // Переходим дальше
        next();
    });
}

type DecodedType = {
    id: string;
    iat: number;
    exp: number;
}