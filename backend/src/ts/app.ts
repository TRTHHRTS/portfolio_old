import {CommonUtils, DINNERBOT, LOG, RISEOFBOT} from "./utils/commonUtils";
import {Request, Response} from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import sassMiddleware from 'node-sass-middleware';
import * as dinner from "./handlers/dinner";
import * as common from "./handlers/common";
import * as rob from "./handlers/riseofbots";
import {init} from "node-persist";
import {verifyToken} from "./handlers/middlewares";
import {DinnerOrderModel, DinnerUserModel, Models} from "./models";
import moment from "moment";
import {Op} from "sequelize";
import {DinnerBotHandler} from "./telegram_bots/dinnerBotHandler";

const cors = require('cors');
export const i18n = require("i18n");

(async () => {
    require("dotenv").config();
    LOG.info("Старт приложения!");

    LOG.info("Конфигурация локализации. Начало");
    i18n.configure({
        locales:['ru', 'en'],
        directory: __dirname + '/locales'
    });
    LOG.info("Конфигурация локализации. Конец");

    LOG.info("Инициализация кэша. Начало.");
    await init({
        dir: 'persist-cache',
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,
        ttl: false
    });
    LOG.info("Инициализация кэша. Конец.");

    const httpPort = process.env.HTTP_PORT;
    const app = express();

    app.use(i18n.init);

    app.set('port', httpPort);

    await Models.init();

    try {
        LOG.info("Конфигурация крон. Начало");
        const schedule = require('node-schedule');
        LOG.info("Конфигурация крон. Запуск задачи напоминания по настройкам пользователя");
        schedule.scheduleJob('0 9-12 * * 1-5', async function() {
            try {
                LOG.info(`Крон задача напоминания. Начало`);
                const currentDate = moment(new Date());
                const users = await Models.DinnerUserSettings.findAll({where: {need_notify: true}, raw: true});
                const nextDinnerDay = await Models.DinnerDayModel.findOne({where: {dinner_date: {[Op.gt]: currentDate.format("YYYY-MM-DD")}}});
                if (users) {
                    for (let user of users) {
                        if (user.when_notify === CommonUtils.currentHour()) {
                            const userOrders = await Models.DinnerOrderModel.findAll({where: {telegram_id: user.user_id}}) as DinnerOrderModel[];
                            const filteredUserOrders = userOrders.filter(item => {
                                return nextDinnerDay && moment(item.order_date, "DD.MM.YYYY").diff(moment(nextDinnerDay.dinner_date), 'days') === 0;
                            });
                            if (!filteredUserOrders.length) {
                                if (!await Models.DinnerNoNotifyModel.findOne({where: {user_id: user.user_id, day: currentDate.format("YYYY-MM-DD")}})) {
                                    LOG.info(`Крон задача. Посылаем сообщение пользователю ${user.user_id}, режим=${user.need_notify}, время_уведомления=${user.when_notify}, текущий_час=${CommonUtils.currentHour()}`);
                                    await DINNERBOT.sendMessageToClient(user.user_id, "Напоминаю заказать обед!", DinnerBotHandler.getNotifyMessageButtons());
                                } else {
                                    LOG.info(`Крон-задача. Пользователь временно отключил напоминания на сегодня. НЕ отправляем сообщение`);
                                }
                            } else {
                                LOG.info(`Крон задача. Пользователь ${user.user_id}, уже заказал обед на ${moment(nextDinnerDay.dinner_date).format("DD.MM.YYYY")}`);
                            }
                        }
                    }
                }
            } catch (e) {
                LOG.error(`Крон задача напоминания. Ошибка`, e);
            } finally {
                LOG.info(`Крон задача напоминания. Конец`);
            }
        });
        LOG.info("Конфигурация крон. Запуск задачи повторных напоминаний о заказе обеда");
        schedule.scheduleJob('10,20,30,40,50,59 9-13 * * 1-5', async function() {
            try {
                LOG.info(`Крон задача 2. Начало`);
                const users = await Models.DinnerUserSettings.findAll({
                    where: {need_notify: true},
                    raw: true
                }) as DinnerUserModel[];
                if (!users.length) {
                    LOG.info(`Крон задача 2. Не найдено пользователей с активированным напоминанием.`);
                    return;
                }
                const currentDate = new Date();
                const nextDinnerDay = await Models.DinnerDayModel.findOne({where: {dinner_date: {[Op.gt]: moment(currentDate).format("YYYY-MM-DD")}}});
                for (let user of users) {
                    LOG.info(`Крон задача 2. Проверяем, заказал ли обед пользователь ${user.user_id}`);
                    if (currentDate.getHours() < parseInt(user.when_notify)) {
                        LOG.info(`Крон задача 2. Пользователю ${user.user_id} еще не было отправлено напоминание`);
                        return;
                    }
                    const userOrders = await Models.DinnerOrderModel.findAll({where: {telegram_id: user.user_id}}) as DinnerOrderModel[];
                    const filteredUserOrders = userOrders.filter(item => {
                        return nextDinnerDay && moment(item.order_date, "DD.MM.YYYY").diff(moment(nextDinnerDay.dinner_date), 'days') === 0;
                    });
                    if (!filteredUserOrders.length) {
                        if (!await Models.DinnerNoNotifyModel.findOne({where: {user_id: user.user_id, day:  moment(currentDate).format("YYYY-MM-DD")}})) {
                            LOG.info(`Крон задача 2. Посылаем сообщение пользователю ${user.user_id}, так как он, кажется, не заказал обед после напоминания`);
                            await DINNERBOT.sendMessageToClient(user.user_id, "Закажи ты уже этот ***** обед!!!", DinnerBotHandler.getNotifyMessageButtons());
                        } else {
                            LOG.info(`Крон-задача. Пользователь временно отключил напоминания на сегодня. НЕ отправляем сообщение`);
                        }
                    } else {
                        LOG.info(`Крон задача 2. У пользователя ${user.user_id} найден обед на следующий день.`);
                    }
                }
            } catch (e) {
                LOG.error(`Крон задача 2. Ошибка`, e);
            } finally {
                LOG.info(`Крон задача 2. Конец`);
            }
        });
    } catch (e) {
        LOG.info("Конфигурация крон. Ошибка: "  + e.message);
    } finally {
        LOG.info("Конфигурация крон. Конец");
    }

    LOG.info("Инициализация ботов. Начало");
    await DINNERBOT.init();
    await RISEOFBOT.init();
    LOG.info("Инициализация ботов. Конец");

    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
    app.use(bodyParser.json({ limit: '10mb' }));

    const corsOptions = {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204
    };

    app.use(cors(corsOptions));

    app.get("/time", common.getTime);

    for (let myHandler of [DINNERBOT, RISEOFBOT]) {
        app.post(`/${myHandler.token}`, (req: Request, res: Response) => { myHandler.handler(req, res); });
    }

    app.get( "/dinners/r/:id",           dinner.getPersonalRatings);
    app.post("/dinners/r/:id",           dinner.setRating);
    app.post("/dinners/resend/:id",      dinner.resendMessage);
    app.post("/dinners/order",           dinner.order);
    app.post("/dinners/days",            dinner.setDinnerDays);
    app.get( "/rob/commands/:id",                  rob.getCommands);
    app.get( "/rob/settings/:id",                  rob.getSettings);
    app.get( "/rob/logs/:id",                      rob.getLogs);
    app.get( "/rob/update/:version",               rob.getBotUpdate);
    app.get( "/rob/distributive",                  rob.getDistributive);
    app.get( "/rob/addcommandplease/:id/:command", rob.addCommand);
    app.post("/rob/settings", verifyToken,         rob.setSettings);
    app.post("/rob/request_logs", verifyToken,     rob.requestLogs);
    app.post("/rob/image/:id",                     rob.saveImage);
    app.post("/rob/logs/:id",                      rob.saveLogs);
    app.post("/rob/send_message/:id",              rob.sendMessageToClient);
    app.post("/rob/send_image/:id",                rob.sendImageToClient);
    app.post("/rob/sendCode",                      rob.sendCode);
    app.post("/rob/check",                         rob.checkCode);

    app.use(sassMiddleware({
            src: __dirname,
            dest: __dirname,
            debug: false
        })
    );

    app.use("/public", express.static(__dirname + '/public_html', {
        etag: false,
        cacheControl: false
    }));
    app.get('/', function(req, res) {
        res.sendFile(__dirname + "/public/index.html");
    });

    app.listen(httpPort, function () {
        LOG.info(`Приложение запущено, порт ${httpPort}`);
    });

    process.on('exit', () => {
        LOG.closeLog("РАБОТА СЕРВЕРА ЗАВЕРШИЛАСЬ");
    });
})();