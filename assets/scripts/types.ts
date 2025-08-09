import { Prefab } from 'cc';

export enum TypeOfFruit {
    APPLE = 'apple',
    ORANGE = 'orange',
    BANANA = 'banana',
    LEMON = 'lemon',
    RASPBERRY = 'raspberry',
}

export const AllFruitsType: TypeOfFruit[] = [
    TypeOfFruit.APPLE,
    TypeOfFruit.ORANGE,
    TypeOfFruit.BANANA,
    TypeOfFruit.LEMON,
    TypeOfFruit.RASPBERRY,
];

export enum TypeOfDangerousFruit {
    MUSHROOM = 'mushroom',
}

export const AllDangerousFruitsType: TypeOfDangerousFruit[] = [TypeOfDangerousFruit.MUSHROOM]; // todo: you can add a lot of dangerous fruits

export enum TypeOfLabel {
    SCORE = 'score',
    HEALTH = 'health',
    BONUS = 'bonus',
}

export type FruitPrefabElements<Fruits> = {
    type: Fruits;
    prefab: Prefab;
};

export enum SoundName {
    BACKGROUND = 'back',
    CATCH_GOOD_FRUIT = 'bucket',
    CATCH_BAD_FRUIT = 'damage',
    WIN = 'gameWin',
    LOSE = 'gameOver',
    BONUS = 'bonus',
}
