import R = require("ramda");
import {parseDecimal, readFileContentForDay} from "./input";

const splitAndParse = R.pipe(R.split(','), R.map(R.trim), R.map(parseDecimal));

const handleOperation = (program: number[], index: number = 0) => {
    if (program[index] === 99) {
        return program;
    }

    const valueAt = (i) => program[i];

    const operation = program[index] === 1 ? R.add : R.multiply;
    const newValue = operation(valueAt(program[index + 1]), valueAt(program[index + 2]));
    const updatedProgram = R.update(program[index + 3], newValue, program)

    return handleOperation(updatedProgram, index + 4);
};

const programAlarm = (noun, verb) => R.pipe(R.update(1, noun), R.update(2, verb));

const runProgram = (noun, verb, p) => R.pipe(programAlarm(noun, verb), handleOperation, R.head)(p);

(async () => {
    const program = await R.pipe(readFileContentForDay, R.andThen(splitAndParse))(2)

    const result = runProgram(12, 2, program);
    console.log(result);

    //part 2
    const possibilities = R.xprod(R.range(0, 100), R.range(0, 100));
    const hasResult = R.curry((result, [noun, verb]) => runProgram(noun, verb, program) === result);
    const [noun, verb] = R.head(R.dropWhile(R.complement(hasResult(19690720)), possibilities));
    console.log(100 * noun + verb);
})();