const min = 124075;
const max = 580769;

const range = function* (min, max) {
    let i = min;
    while (i <= max) {
        yield i++;
    }
};

const containsTwoAdjacentNumbers = (v) => {
    const value = v.toString();

    const an = (i) => {
        if (i + 1 === value.length) {
            return false;
        }
        return value.charAt(i) === value.charAt(i + 1) || an(i + 1);
    };

    return an(0);
};

const neverDecreasing = (v) => {
    const value = v.toString();

    const nd = (i) => {
        if (i + 1 === value.length) {
            return true;
        }

        return (parseInt(value.charAt(i))) <= parseInt(value.charAt(i + 1)) && nd(i + 1);
    }

    return nd(0)
};

// Part 1
const count = [...range(min, max)]
    .filter(containsTwoAdjacentNumbers)
    .filter(neverDecreasing)
    .length

console.log(count);