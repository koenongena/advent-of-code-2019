import R = require("ramda");
import {readFileContentForDay, splitNumberList} from "./input";

const fileReader = (day) => () => readFileContentForDay(day);

const firstParamPositionMode = (n) => (Math.floor(n / 100) % 10) == 0;
const secondParamPositionMode = (n) => (Math.floor(n / 1000) % 10) == 0;

const addition = (instructionCode) => R.curry((program, a, b, target) => {
    const v1 = firstParamPositionMode(instructionCode) ? program[a] : a;
    const v2 = secondParamPositionMode(instructionCode) ? program[b] : b;
    return R.update(target, R.add(v1, v2), program);
});

const multiply = (instructionCode) => R.curry((program, a, b, target) => {
    const v1 = firstParamPositionMode(instructionCode) ? program[a] : a;
    const v2 = secondParamPositionMode(instructionCode) ? program[b] : b;
    return R.update(target, R.multiply(v1, v2), program);
});

const input = (instructionCode) => R.curry((program, target) => {
    return R.update(target, 1, program);
});

const output = (instructionCode) => (program, target) => {
    const value = firstParamPositionMode(instructionCode) ? program[target] : target;
    console.log(value);
    return program;
};

const getInstruction = (instructionCode: number) => {
    if (instructionCode % 100 == 1) {
        return addition(instructionCode);
    } else if (instructionCode % 100 == 2) {
        return multiply(instructionCode);
    } else if (instructionCode % 100 == 3) {
        return input(instructionCode)
    } else if (instructionCode % 100 == 4) {
        return output(instructionCode);
    }
}

const getStep = (instructionCode: number) => {
    let target = instructionCode % 100;
    if (R.includes(target, [1, 2])) {
        return 4;
    }
    return 2;
};

(async () => {

    const program = await R.pipe(fileReader(5), R.andThen(splitNumberList()))()

    const stopState = ({program, index}) => program[index] == 99;
    R.until(stopState, ({program, index}) => {
        const instruction = getInstruction(program[index]);
        const updatedProgram = instruction(program, program[index + 1], program[index + 2], program[index + 3]);
        const step = getStep(program[index]);
        return {program: updatedProgram, index: index + step}
    }, {program: program, index: 0});
})();
