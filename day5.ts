import R = require("ramda");
import {readFileContentForDay, splitNumberList} from "./input";

const fileReader = (day) => () => readFileContentForDay(day);

const addition = R.curry((program, index) => {
    const v1 = getFirstParameter(program, index);
    const v2 = getSecondParameter(program, index);
    return R.update(program[index + 3], R.add(v1, v2), program);
});

const getFirstParameter = (p, index) => {
    const instructionCode = p[index];
    return (Math.floor(instructionCode / 100) % 10) == 0 ? p[p[index + 1]] : p[index + 1];
}
const getSecondParameter = (p, index) => {
    const instructionCode = p[index];
    return (Math.floor(instructionCode / 1000) % 10) == 0 ? p[p[index + 2]] : p[index + 2];
}

const multiply = R.curry((program, index) => {
    const v1 = getFirstParameter(program, index);
    const v2 = getSecondParameter(program, index);
    return R.update(program[index + 3], R.multiply(v1, v2), program);
});

const input = (inputValue) => R.curry((program, index) => {
    const target = program[index + 1];
    return R.update(target, inputValue, program);
});

const output = (program, index) => {
    const value = getFirstParameter(program, index)
    if (value !== 0) console.log(value);
    return program;
};

const lessThan = (program, index) => {
    const v1 = getFirstParameter(program, index);
    const v2 = getSecondParameter(program, index);
    return R.update(program[index + 3], v1 < v2 ? 1 : 0, program);
};
const eq = (program, index) => {
    const v1 = getFirstParameter(program, index);
    const v2 = getSecondParameter(program, index);
    return R.update(program[index + 3], v1 === v2 ? 1 : 0, program);
};

const getInstruction = R.curry((inputValue, instructionCode: number) => {
    const opCode = instructionCode % 100;
    if (opCode == 1) {
        return addition;
    } else if (opCode == 2) {
        return multiply;
    } else if (opCode == 3) {
        return input(inputValue);
    } else if (opCode == 4) {
        return output;
    } else if (R.includes(opCode, [5, 6])) {
        return R.identity;
    } else if (opCode === 7) {
        return lessThan;
    } else if (opCode === 8) {
        return eq;
    } else {
        throw new Error(opCode + " is not supported. Instruction code = " + instructionCode)
    }
});

const jumpIfFirstParam = R.curry((predicate, program, index) => {
    if (predicate(getFirstParameter(program, index))) {
        return getSecondParameter(program, index);
    }
    return index + 3;
});

const jumpIfTrue = jumpIfFirstParam(R.complement(R.equals(0)));
const jumpIfFalse = jumpIfFirstParam(R.equals(0));

const getNextInstructionPointer = (program: number[], instructionCode: number, index: number) => {
    const opcode = instructionCode % 100;
    if (opcode === 5) {
        return jumpIfTrue(program, index);
    }
    if (opcode === 6) {
        return jumpIfFalse(program, index);
    }
    if (R.includes(opcode, [1, 2, 7, 8])) {
        return index + 4;
    }

    return index + 2;
};

const determineInstruction = (program: number[], input = 1) => {
    const stopState = ({program, index}) => program[index] == 99;
    const instructionFor = getInstruction(input);

    R.until(stopState, ({program, index}) => {
        // console.log("At index " + index + " we find " + program[index]);
        const instruction = instructionFor(program[index]);
        const updatedProgram = instruction(program, index);
        const nextInstructionPointer = getNextInstructionPointer(program, program[index], index);
        return {program: updatedProgram, index: nextInstructionPointer}
    })({program: program, index: 0});
};
(async () => {

    const program = await R.pipe(fileReader(5), R.andThen(splitNumberList()))()

    determineInstruction(program, 1);
    determineInstruction(program, 5);
})();
