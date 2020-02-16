import {BOOLEAN, BuildOptions, DATE, INTEGER, Model, Sequelize, STRING, TIME} from "sequelize";
import {LOG} from "./utils/commonUtils";

/**
 * Класс, определяющий модели
 */
export class Models {

    static ROBSettings: ROBSettingsModelStatic = null;
    static ROBFeedback: ROBFeedbackModelStatic = null;
    static DinnerRecord: DinnerModelStatic = null;
    static ResendCommand: ResendCommandModelStatic = null;
    static PropertyRecord: PropertiesModelStatic = null;
    static DinnerUserSettings: DinnerUserModelStatic = null;
    static DinnerOrderModel: DinnerOrderModelStatic = null;
    static DinnerDayModel: DinnerDayModelStatic = null;
    static DinnerNoNotifyModel: DinnerNoNotifyModelStatic = null;

    static SEQ: Sequelize = null;

    /**
     * Инициализация моделей
     */
    static async init() {
        try {
            LOG.info("Инициализация моделей. Начало");
            LOG.info("Инициализация моделей. Соединения к БД с помощью sequelize");
            Models.SEQ = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
                host: process.env.DB_HOST,
                dialect: "mysql",
                port: Number(process.env.DB_PORT),
                pool: {
                    max: 5,
                    min: 0,
                    idle: 10000
                }
            });
            try {
                await Models.SEQ.authenticate();
                LOG.info("Инициализация моделей. Соединения к БД с помощью sequelize. Соединение успешно установлено");
            } catch (err) {
                LOG.error("Инициализация моделей. Соединения к БД с помощью sequelize. Ошибка соединения", err);
            }
            LOG.info("Инициализация модели настроек RiseOfBot бота");
            Models.ROBSettings = <ROBSettingsModelStatic>Models.SEQ.define("riseofbot_settings", {
                telegram_id: {type: INTEGER, primaryKey: true, autoIncrement: true},
                content: {type: STRING, allowNull: true}
            }, {
                timestamps: false
            });
            LOG.info("Инициализация модели записей заказа обеда");
            Models.DinnerRecord = <DinnerModelStatic>Models.SEQ.define('record', {
                eater: {type: STRING},
                chat_id: {type: STRING},
                name: {type: STRING},
                clear_name: {type: STRING},
                count: {type: INTEGER},
                price: {type: STRING},
                rating: {type: INTEGER}
            });
            LOG.info("Инициализация модели команд бота");
            Models.ResendCommand = <ResendCommandModelStatic>Models.SEQ.define("commands", {
                id: {type: INTEGER, primaryKey: true, autoIncrement: true},
                chat_id: {type: STRING},
                name: {type: STRING},
                payload: {type: STRING, allowNull: true},
            }, {
                timestamps: false
            });
            LOG.info("Инициализация модели свойств");
            Models.PropertyRecord = <PropertiesModelStatic>Models.SEQ.define('properties', {
                id: {type: INTEGER, primaryKey: true},
                name: {type: STRING},
                value: {type: STRING}
            }, {
                timestamps: false
            });
            LOG.info("Инициализация модели настроек пользователя обедов");
            Models.DinnerUserSettings = <DinnerUserModelStatic>Models.SEQ.define("user_settings", {
                user_id: {type: STRING, primaryKey: true},
                chat_id: {type: STRING},
                need_notify: {type: BOOLEAN},
                when_notify: {type: STRING},
                need_order_notify: {type: BOOLEAN},
                when_order_notify: {type: STRING},
                admin_rights: {type: BOOLEAN},
            }, {
                timestamps: false
            });
            LOG.info("Инициализация модели заказов обедов");
            Models.DinnerOrderModel = <DinnerOrderModelStatic>Models.SEQ.define("orders", {
                id: {type: INTEGER, primaryKey: true},
                telegram_id: {type: INTEGER},
                order_date: {type: STRING},
                data: {type: STRING},
            }, {
                timestamps: false
            });
            LOG.info("Инициализация модели обратной связи пользователей");
            Models.ROBFeedback = <ROBFeedbackModelStatic>Models.SEQ.define("user_feedback", {
                telegram_id: {type: INTEGER, primaryKey: true},
                text: {type: STRING},
                created_at: {type: STRING}
            }, {
                tableName: "user_feedback",
                timestamps: false
            });
            LOG.info("Инициализация модели дней обеда пользователей");
            Models.DinnerDayModel = <DinnerDayModelStatic>Models.SEQ.define("dinner_days", {
                id: {type: INTEGER, primaryKey: true},
                dinner_date: {type: STRING}
            }, {
                tableName: "dinner_days"
            });
            LOG.info("Инициализация модели ручных отключений напоминаний на день");
            Models.DinnerNoNotifyModel = <DinnerNoNotifyModelStatic>Models.SEQ.define("user_no_notify", {
                id: {type: INTEGER, primaryKey: true},
                user_id: {type: INTEGER},
                day: {type: STRING}
            }, {
                tableName: "user_no_notify",
                timestamps: false
            });
        } catch (e) {
            LOG.error("Ошибка инициализации моделей", e);
        } finally {
            LOG.info("Инициализация моделей. Конец.");
        }
    }
}

export interface ROBSettingsModel extends Model {
    telegram_id: number;
    content: string;
}
export interface DinnerModel extends Model {
    eater: string;
    chat_id: string;
    name: string;
    clear_name: string;
    count: number;
    price: string;
    rating: number;
}
export interface PropertiesModel extends Model {
    id: number;
    name: string;
    value: string;
}
export interface DinnerUserModel extends Model {
    user_id: string;
    chat_id: string;
    need_notify: boolean;
    when_notify: string;
    need_order_notify: boolean;
    when_order_notify: string;
    admin_rights: boolean;
}
export interface DinnerOrderModel extends Model {
    id?: number;
    telegram_id: number;
    order_date: string;
    data: string;
}

export interface ResendCommandModel extends Model {
    id: number;
    chat_id: string;
    name: string;
    payload?: string;
}

export interface ROBFeedbackModel extends Model {
    telegram_id: number;
    text: string;
    created_at: string;
}

export interface DinnerDayModel extends Model {
    id: number;
    dinner_date: string;
    createdAt: string;
    updatedAt: string;
}

export interface DinnerNoNotifyModel extends Model {
    id: number;
    user_id: number;
    day: string;
}

export type ROBFeedbackModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ROBFeedbackModel;
}
export type ROBSettingsModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ROBSettingsModel;
}
export type DinnerModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): DinnerModel;
}
export type PropertiesModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): PropertiesModel;
}
export type DinnerUserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): DinnerUserModel;
}
export type DinnerOrderModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): DinnerOrderModel;
}
export type ResendCommandModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): ResendCommandModel;
}
export type DinnerDayModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): DinnerDayModel;
}
export type DinnerNoNotifyModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): DinnerNoNotifyModel;
}