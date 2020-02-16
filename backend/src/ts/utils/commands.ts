/**
 * Команды боту
 */
export enum Commands {
    /**
     * Запуск бота
     * Использование: /СТАРТ
     */
    LAUNCH = "СТАРТ",
    LAUNCH_EN = "LAUNCH",
    /**
     * Остановка бота
     * Использование: /СТОП
     */
    STOP = "СТОП",
    STOP_EN = "STOP",
    /**
     * Получение скрина от бота
     * Использование: /СКРИН
     */
    SCREEN = "СКРИН",
    SCREEN_EN = "SCREEN",
    /**
     * Использовать определенное количество бутылок восстановления очков действия
     * 1й_параметр: количество используемых бутылок
     * Использование: /ОД 1й_параметр
     */
    AP = "ОД",
    AP_EN = "AP",
    /**
     * Получить логи работы бота
     * Возвращает текстовый файл с логами работы бота
     */
    LOGS = "ЛОГИ",
    LOGS_EN = "LOGS",
    /**
     * Загружает настройки для бота с сервера в бота и применяет их
     * Запрещено использовать пользователям
     * Использование: не используется в явном виде
     */
    RELOAD_CONFIGURATION = "RELOAD_CONFIGURATION",
    /**
     * Принудительное обновление
     * Запрещено использовать пользователям
     */
    FORCE_UPDATE = "FORCE_UPDATE",
    /**
     * Аварийно завершает работу бота
     * Запрещено использовать пользователям
     */
    FORCE_EXIT = "FORCE_EXIT",
    /**
     * Тестовая команда, не несет никакой полезной нагрузки
     * Использование: /ТЕСТ
     */
    TEST = "ТЕСТ"
}

/**
 * Проверяет легальность команды (может ли пользователь ее вводить)
 * @param name название команды
 */
export function isCommandLegal(name: string): boolean {
    return (<string[]> Object.values(Commands)).includes(name) && !isInternalCommand(name);
}

/**
 * Проверяет, является ли команда "внутренней", то есть запрещенной к использованию клиентами
 * @param name название команды
 */
export function isInternalCommand(name: string): boolean {
    return name === Commands.RELOAD_CONFIGURATION ||
        name === Commands.FORCE_EXIT;
}