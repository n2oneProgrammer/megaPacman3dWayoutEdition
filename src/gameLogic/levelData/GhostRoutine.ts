import {GhostState} from "../GhostState";

let level1: [GhostState, number][] = [
    [GhostState.SCATTER, 30],
    [GhostState.CHASE, 2 * 60],
    [GhostState.SCATTER, 60],
    [GhostState.CHASE, 560],
    [GhostState.SCATTER, 80],
    [GhostState.CHASE, 10 * 60],
    [GhostState.SCATTER, 3 * 60],
    [GhostState.CHASE, -1],
];
let level2_4: [GhostState, number][] = [
    [GhostState.SCATTER, 20],
    [GhostState.CHASE, 3 * 60],
    [GhostState.SCATTER, 70],
    [GhostState.CHASE, 4 * 60],
    [GhostState.SCATTER, 60],
    [GhostState.CHASE, -1],
];
let level5: [GhostState, number][] = [
    [GhostState.SCATTER, 25],
    [GhostState.CHASE, 4 * 60],
    [GhostState.SCATTER, 60],
    [GhostState.CHASE, 8 * 60],
    [GhostState.SCATTER, 20],
    [GhostState.CHASE, -1],
];
export default function (level: number): [GhostState, number][] {
    if (level == 1) {
        return level1;
    }
    if (level <= 4) {
        return level2_4;
    }
    return level5;
}
