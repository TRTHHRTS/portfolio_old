/**
 * Генерирует дефолтные настройки бота
 * @return дефолтные настройки бота строкой JSON.stringify
 */
export function getDefaultSettings(lang = "ru") {
    return {
        lang,
        lagsDelay: 1.5,
        barbariansMaxLvl: 12,
        resourceLvl: 3,
        skipGettingResourcesBonuses: false,
        minLimitResources: 300000,
        templateWarriorsToAttack: 0,
        trainingCount: 150,
        panicTime: 15,
        actionPointLimitForWarMode: 500,
        limitRaidTime: 5,
        buildMode: BuildMode.TOWN_HALL,
        researchMode: ResearchMode.WAR,
        farmKinds: [FarmKind.BARBARIANS, FarmKind.EAT, FarmKind.GOLD, FarmKind.STONE, FarmKind.WOOD],
        skipRaid: false,
        skipGuildHelp: false,
        skipGuildHelpTechnology: false,
        skipWarriors: false,
        skipHospital: false,
        skipTrader: false,
        skipScout: false,
        skipResourcesBuilding: false,
        skipBarracks: false,
        skipBonuses: false,
        coords: {
            scoutBuilding: {
                "x": 0.0,
                "y": 0.0
            },
            eatFarm: {
                "x": 0.0,
                "y": 0.0
            },
            woodFarm: {
                "x": 0.0,
                "y": 0.0
            },
            stoneFarm: {
                "x": 0.0,
                "y": 0.0
            },
            goldenFarm: {
                "x": 0.0,
                "y": 0.0
            },
            barrack_1: {
                "x": 0.0,
                "y": 0.0
            },
            barrack_2: {
                "x": 0.0,
                "y": 0.0
            },
            barrack_3: {
                "x": 0.0,
                "y": 0.0
            },
            barrack_4: {
                "x": 0.0,
                "y": 0.0
            },
            townHallBuilding: {
                "x": 0.0,
                "y": 0.0
            },
            hospitalBuilding: {
                "x": 0.0,
                "y": 0.0
            },
            builderBuilding: {
                "x": 0.0,
                "y": 0.0
            },
            tavernBuilding: {
                "x": 0.0,
                "y": 0.0
            },
            academyBuilding: {
                "x": 0.0,
                "y": 0.0
            },
            traderBuilding: {
                "x": 0.0,
                "y": 0.0
            },
            guildBuilding: {
                "x": 0.0,
                "y": 0.0
            }
        }
    };
}

/**
 * Режим строительства
 */
enum BuildMode {
    // Строительство выключено
    OFF = "OFF",
    // Режим строительства Ратуши и зависимостей
    TOWN_HALL = "TOWN_HALL",
    // Простой режим строительства (через хижину строителей)
    BUILDER_HUT = "BUILDER_HUT"
}

/**
 * Режим изучения исследований в академии
 */
enum ResearchMode {
    // Выключить
    OFF = "OFF",
    // Ветка мира
    PEACE = "PEACE",
    // Военная ветка
    WAR = "WAR"

}

/**
 * Режимы фарма
 */
enum FarmKind {
    BARBARIANS = "BARBARIANS",
    EAT = "EAT",
    WOOD = "WOOD",
    STONE = "STONE",
    GOLD = "GOLD"
}