export interface FluidRect {
    x: number;
    y: number;
    w: number;
    h: number;
}
export type FluidRectList = [number, number, number, number][];

export type FluidRects = Map<string, FluidRect | null>;
