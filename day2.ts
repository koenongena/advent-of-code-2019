const program = [1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 13, 1, 19, 1, 10, 19, 23, 1, 6, 23, 27, 1, 5, 27, 31, 1, 10, 31, 35, 2, 10, 35, 39, 1, 39, 5, 43, 2, 43, 6, 47, 2, 9, 47, 51, 1, 51, 5, 55, 1, 5, 55, 59, 2, 10, 59, 63, 1, 5, 63, 67, 1, 67, 10, 71, 2, 6, 71, 75, 2, 6, 75, 79, 1, 5, 79, 83, 2, 6, 83, 87, 2, 13, 87, 91, 1, 91, 6, 95, 2, 13, 95, 99, 1, 99, 5, 103, 2, 103, 10, 107, 1, 9, 107, 111, 1, 111, 6, 115, 1, 115, 2, 119, 1, 119, 10, 0, 99, 2, 14, 0, 0]


const sum = (a, b) => a + b;
const multiply = (a, b) => a * b;

function determineOperation(operation: number) {

    if (operation === 1) {
        return sum;
    } else if (operation === 2) {
        return multiply;
    } else {
        throw new Error(operation + " is not supported")
    }
}

// part 1
const handleOperation = (program: number[], index: number = 0) => {
    if (index > program.length) {
        return program;
    }

    if (program[index] === 99) {
        return program;
    }

    const operation = determineOperation(program[index]);
    let indexValue1 = program[index + 1];
    let indexValue2 = program[index + 2];
    let indexResult = program[index + 3];
    program[indexResult] = operation(program[indexValue1], program[indexValue2]);

    return handleOperation(program, index + 4);
};

function programAlarm(p, noun = 12, verb = 2) {
    const twelveO02 = [...p];
    twelveO02[1] = noun;
    twelveO02[2] = verb;
    return twelveO02;
}

const result = handleOperation( programAlarm(program));

console.log(result[0]);

//part 2
for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
        let result = handleOperation(programAlarm(program, noun, verb))[0];
        if (result == 19690720) {
            console.log(100 * noun + verb);
        }
    }
}

