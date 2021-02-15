import * as R from 'ramda';
import {sqr, sqrt} from "./math";

export type Point = { x: number, y: number; };
export type Point2D = Point;

export type Line = {
    begin: Point,
    end: Point
}


export const manhattanDistance = (p1: Point, p2: Point = {x: 0, y: 0}) => {
    return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
};

export function intersection(from1: Point2D, to1: Point2D, from2: Point2D, to2: Point2D): Point2D {
    const dX: number = to1.x - from1.x;
    const dY: number = to1.y - from1.y;

    const determinant: number = dX * (to2.y - from2.y) - (to2.x - from2.x) * dY;
    if (determinant === 0) return undefined; // parallel lines

    const lambda: number = ((to2.y - from2.y) * (to2.x - from1.x) + (from2.x - to2.x) * (to2.y - from1.y)) / determinant;
    const gamma: number = ((from1.y - to1.y) * (to2.x - from1.x) + dX * (to2.y - from1.y)) / determinant;

    // check if there is an intersection
    if (!(0 <= lambda && lambda <= 1) || !(0 <= gamma && gamma <= 1)) return undefined;

    return {
        x: from1.x + lambda * dX,
        y: from1.y + lambda * dY,
    };
}

export const lineIntersection = (line1: Line, line2: Line) => {
    return intersection(line1.begin, line1.end, line2.begin, line2.end);
};

export type Direction = 'U' | 'D' | 'L' | 'R';

const moveX = R.curry((steps: number, p: Point) => ({x: p.x + steps, y: p.y}));
const moveY = R.curry((steps: number, p: Point) => ({x: p.x, y: p.y + steps}));

export const move = R.curry((direction: Direction, steps: number, p: Point) => {
    switch (direction) {
        case 'R':
            return moveX(steps, p);
        case 'L':
            return moveX(-1 * steps, p);
        case 'U':
            return moveY(steps, p);
        case 'D':
            return moveY(-1 * steps, p);
    }
});

export const lengthOf = (line: Line) => {
    if (line.begin.x === line.end.x) {
        return Math.abs(line.begin.y - line.end.y);
    } else {
        return Math.abs(line.begin.x - line.end.x);
    }
};



export const distance = (p1: Point, p2: Point) => {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    return Math.sqrt(a * a + b * b);
};


export const lineContainsPoint = R.curry((p: Point, line: Line) => sqrt(distanceToLine(p, line)) == 0);

const squaredDistance = (begin, end) => sqr(begin.x - end.x) + sqr(begin.y - end.y);

export const distanceToLine = (p, line: Line) => {
    const {begin, end} = line;

    const l2 = squaredDistance(begin, end);

    if (l2 == 0) return squaredDistance(p, begin);

    const t = ((p.x - begin.x) * (end.x - begin.x) + (p.y - begin.y) * (end.y - begin.y)) / l2;

    if (t < 0) return squaredDistance(p, begin);
    if (t > 1) return squaredDistance(p, end);

    return squaredDistance(p, {x: begin.x + t * (end.x - begin.x), y: begin.y + t * (end.y - begin.y)});
};

export const intersections = (lines1: Line[], lines2: Line[]) => {
    const combinations = R.xprod(lines1, lines2);
    const validIntersections = R.pipe(
        R.map(([l1, l2]) => lineIntersection(l1, l2)),
        R.filter(R.complement(R.isNil))
    );
    return validIntersections(combinations);
};

export const isOrigin = (p: Point) => p.x == 0 && p.y == 0;
export const isNotOrigin = R.complement(isOrigin);