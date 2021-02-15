import * as R from "ramda";
import {readLinesForDay} from "./input";

const parseMass = R.partialRight(parseInt, [10]);

const calculateFuelMass = mass => Math.floor(mass / 3.0) - 2;

const calculateFuel = (masses: number[]) => {
    return R.sum(R.map(calculateFuelMass, masses));
};

const fuelForTheFuel = (startFuel: number) => {
    const fuel = calculateFuelMass(startFuel);
    return fuel > 0 ? fuel + fuelForTheFuel(fuel) : 0;
};


(async () => {
    const masses = await R.pipe(readLinesForDay, R.andThen(R.map(parseMass)))(1);

    console.log(`Part 1: ${calculateFuel(masses)}`);

    // part 2
    const result = R.pipe(R.map(fuelForTheFuel), R.sum)(masses);
    console.log(`Part 2: ${result}`);
})();