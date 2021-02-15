import R = require("ramda");
import {parseDecimal, readFileContentForDay} from "./input";
import {
    Direction,
    distance,
    intersections, isNotOrigin, isOrigin,
    lengthOf,
    Line,
    lineContainsPoint,
    manhattanDistance,
    move,
    Point
} from "./geometry";


const extractLines = R.reduce((lines: Line[], spec: string) => {
    const steps: number = parseDecimal(R.tail(spec));
    const movement = R.pipe(R.toUpper, R.head, (s) => s as Direction)(spec);

    const currentPosition = R.propOr({x: 0, y: 0}, "end", R.last(lines)) as Point;
    const nextPosition = move(movement, steps, currentPosition);
    return R.append({begin: currentPosition, end: nextPosition}, lines);
}, []);


(async () => {
    const [wire1Specs, wire2Specs] = await R.pipe(
        readFileContentForDay,
        R.andThen(R.split('\n')),
        R.andThen(R.map(R.split(',')))
    )(3)


    const numberAscending = (a, b) => a - b;

    const wires1 = extractLines(wire1Specs);
    const wires2 = extractLines(wire2Specs);

    //Part 1
    const shortestPath = R.pipe(
        intersections,
        R.filter(R.complement(isOrigin)),
        R.map(manhattanDistance),
        R.sort((a: number, b: number) => a - b),
        R.head,
    )(wires1, wires2)

    console.log(shortestPath);


    //Part 2
    const stepsToIntersection = (lines: Line[], point: Point) => {
        let steps = 0;
        for (const line of lines) {
            if (lineContainsPoint(point, line)) {
                return steps + distance(point, line.begin);
            } else {
                steps += lengthOf(line);
            }
        }
        return 0;
    };

    const steps = intersections(wires1, wires2)
        .map(i => {
            const line1Steps = stepsToIntersection(wires1, i);
            const line2Steps = stepsToIntersection(wires2, i);
            return line1Steps + line2Steps;
        }).sort(numberAscending)[0];
    console.log(steps);
})();