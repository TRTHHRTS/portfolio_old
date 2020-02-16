import {enums} from "./enums";

export const messages = {
    ru: {
        ...enums.ru,
        app: {
            menu_main: "ГЛАВНАЯ",
            menu_settings: "НАСТРОЙКА",
            menu_status: "СТАТУС",
            menu_auth: "АУТЕНТИФИКАЦИЯ",
            menu_help: "ПОМОЩЬ",
            menu_lang: "ЯЗЫК"
        },
        home: {
            text1: "Добро пожаловать на страницу RiseOfBot!",
            text2: "НАЧАТЬ ИСПОЛЬЗОВАТЬ БОТА!",
            text3: "Чтобы начать пользоваться ботом - нажмите на кнопку выше или найдите бота вручную (@riseofbot)",
            text4: "ВАЖНО: ",
            text5: "чтобы ссылка корректно открылась, у вас должен быть настроен прокси или VPN для взаимодействия с серверами Telegram.",
            text6: "Альтернативный вариант: ",
            text7: "найдите бота в Telegram: @riseofbot и нажмите \"Запустить\""
        },
        settings: {
            screen_request: "Запросить новый скрин деревни",
            save: "Сохранить",
            cancel: "Отмена",
            commonTab: "Общие настройки",
            switchesTab: "Режимы работы бота",
            coordinatesTab: "Координаты зданий",
            commonPanel: {
                buildMode: {
                    tooltip1: "\"Ускоренный\" - улучшает только те здания, которые требуются для улучшения Ратуши",
                    tooltip2: "\"По умолчанию\" - равномерно поднимает уровень всех зданий"
                }
            },
            switchesPanel: {
                buildMode: "Режим строительства",
                researchMode: "Режим исследования",
                farmMode: "Режим фарма"
            }
        }
    },
    en: {
        ...enums.en,
        app: {
            menu_main: "MAIN PAGE",
            menu_settings: "SETTINGS",
            menu_status: "STATUS",
            menu_auth: "AUTHENTICATION",
            menu_help: "HELP",
            menu_lang: "LANG"
        },
        home: {
            text1: "Welcome to the RiseOfBot page!",
            text2: "START USING BOT!",
            text3: "Click on the button above or find bot manually (@riseofbot) for start using RiseOfBot",
            text4: "IMPORTANT: ",
            text5: "you should set proxy or VPN if you can't open our Telegram bot.",
            text6: "ALTERNATIVE VARIANT: ",
            text7: "find bot in Telegram: @riseofbot и click on the \"Start\" button"
        },
        settings: {
            screen_request: "Request new village screen",
            save: "Save",
            cancel: "Cancel",
            commonTab: "Common settings",
            switchesTab: "Bot work modes",
            coordinatesTab: "Buildings coordinates",
            commonPanel: {
                buildMode: {
                    tooltip1: "\"Accelerated\" - only improves the buildings that are required to develop the Town Hall",
                    tooltip2: "\"Default\" - evenly raises the level of all buildings"
                }
            },
            switchesPanel: {
                buildMode: "Build mode",
                researchMode: "Research mode",
                farmMode: "Farm mode"
            }
        }
    }
};