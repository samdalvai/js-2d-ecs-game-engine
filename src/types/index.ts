export type Vec2 = {
    x: number;
    y: number;
};

export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type TileMap = {
    tiles: number[][];
};

export enum Flip {
    NONE,
    HORIZONTAL,
    VERTICAL,
}