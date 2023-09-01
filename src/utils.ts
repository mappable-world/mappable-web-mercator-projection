export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export function cycleRestrict(value: number, min: number, max: number): number {
    return value - Math.floor((value - min) / (max - min)) * (max - min);
}

export function restrict(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}
