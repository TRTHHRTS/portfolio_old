export const BUILDING_NAMES = {
    "scoutBuilding": "Лагерь разведчиков",
    "eatFarm": "Ферма",
    "woodFarm": "Лесопилка",
    "stoneFarm": "Карьер",
    "goldenFarm": "Золотая шахта",
    "barrack_1": "Казарма",
    "barrack_2": "Стойло",
    "barrack_3": "Стрельбище",
    "barrack_4": "Мастерская",
    "townHallBuilding": "Ратуша",
    "hospitalBuilding": "Госпиталь",
    "builderBuilding": "Хижина строителя",
    "tavernBuilding": "Таверна",
    "academyBuilding": "Академия",
    "traderBuilding": "Перекладной пункт",
    "guildBuilding": "Центр альянса"
};

export type CurrentCoords = {
    key: CoordKey;
    name: string;
    x: number;
    y: number;
}

export type CoordsType = {
    x: number;
    y: number;
}

export type CoordKey = "scoutBuilding" |
    "eatFarm" |
    "woodFarm" |
    "stoneFarm" |
    "goldenFarm" |
    "barrack_1" |
    "barrack_2" |
    "barrack_3" |
    "barrack_4" |
    "townHallBuilding" |
    "hospitalBuilding" |
    "builderBuilding" |
    "tavernBuilding" |
    "academyBuilding" |
    "traderBuilding" |
    "guildBuilding";

export type SettingsType = {
    lagsDelay: number;
    barbariansMaxLvl: number;
    resourceLvl: number;
    minLimitResources: number;
    templateWarriorsToAttack: number;
    trainingCount: number;
    panicTime: number;
    actionPointLimitForWarMode: number;
    limitRaidTime: number;
    buildMode: BuildMode;
    researchMode: ResearchMode;
    farmKinds: string[];
    skipRaid: boolean;
    skipGettingResourcesBonuses: boolean;
    skipGuildHelp: boolean;
    skipGuildHelpTechnology: boolean;
    skipWarriors: boolean;
    skipHospital: boolean;
    skipTrader: boolean;
    skipScout: boolean;
    skipResourcesBuilding: boolean;
    skipBarracks: boolean;
    skipBonuses: boolean;
    coords: {
        scoutBuilding: CoordsType;
        eatFarm: CoordsType;
        woodFarm: CoordsType;
        stoneFarm: CoordsType;
        goldenFarm: CoordsType;
        barrack_1: CoordsType;
        barrack_2: CoordsType;
        barrack_3: CoordsType;
        barrack_4: CoordsType;
        townHallBuilding: CoordsType;
        hospitalBuilding: CoordsType;
        builderBuilding: CoordsType;
        tavernBuilding: CoordsType;
        academyBuilding: CoordsType;
        traderBuilding: CoordsType;
        guildBuilding: CoordsType;
    };
};

/**
 * Режим строительства
 */
export enum BuildMode {
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
export enum ResearchMode {
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
export enum FarmKind {
    BARBARIANS = "BARBARIANS",
    EAT = "EAT",
    WOOD = "WOOD",
    STONE = "STONE",
    GOLD = "GOLD"
}