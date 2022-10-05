export const deg2rad = (deg: number) => {
    return deg * Math.PI / 180;
};

export const interpolate = (i0: number, d0: number, i1: number, d1: number) => {
    if (i0 == i1) {
        return [d0];
    }
    const values: number[] = [];
    const a = (d1 - d0) / (i1 - i0);
    let d = d0;
    for (let i = i0; i <= i1; i++) {
        values.push(d);
        d = d + a;
    }
    return values;
};

export function map(
    v: number,
    minIn: number,
    maxIn: number,
    minOut: number,
    maxOut: number
): number {
    return ((v - minIn) * (maxOut - minOut)) / (maxIn - minIn) + minIn;
}