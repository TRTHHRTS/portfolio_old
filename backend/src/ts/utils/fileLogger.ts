import {Logger} from "ts-log";
import * as fs from "fs";

/**
 * Логгер для сервера
 */
export class FileLogger implements Logger {

    /** Имя файла лога */
    private static filename: string;

    /** Дескриптор файла */
    private static descriptor: number;

    /** Конструктор */
    public constructor() {
        FileLogger.filename = FileLogger.getLogFilename();
        FileLogger.descriptor = fs.openSync(FileLogger.filename, "a");
    }

    /**
     * Получает название файла лога
     */
    private static getLogFilename() {
        const date = new Date();
        return `${__dirname}/logs/${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)}.log`;
    }

    public trace(message: string): void {
        this.append("TRACE", message);
    }

    public debug(message: string): void {
        this.append("DEBUG", message);
    }

    public info(message: string): void {
        this.append("INFO ", message);
    }

    public warn(message: string): void {
        this.append("WARN ", message);
    }

    public error(message: string, error?: Error): void {
        this.append("ERROR", `${message} errorMessage="${error.message}" ${JSON.stringify(error)}`);
    }

    public closeLog(message: string) {
        fs.writeSync(FileLogger.descriptor, `${new Date().toLocaleString()} ${message}\n`);
        fs.closeSync(FileLogger.descriptor);
    }

    private append(type: string, message: string) {
        const newFilename = FileLogger.getLogFilename();
        const dateString = new Date().toLocaleString();
        if (!fs.existsSync(newFilename)) {
            fs.writeSync(FileLogger.descriptor, `${dateString} ТЕКУЩИЙ ФАЙЛ ЛОГА БУДЕТ ЗАКРЫТ\n`);
            fs.closeSync(FileLogger.descriptor);
            FileLogger.filename = newFilename;
            FileLogger.descriptor = fs.openSync(FileLogger.filename, "a");
            fs.writeSync(FileLogger.descriptor, `${dateString} БЫЛ СОЗДАН НОВЫЙ ФАЙЛ ЛОГА\n`);
        }
        fs.writeSync(FileLogger.descriptor, `${dateString} ${type} ${message}\n`);
    }
}