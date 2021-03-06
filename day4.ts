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

function indexOfNextGroup(v) {
    const indexOfNextDifferentChar = (index) => {
        if (v.charAt(0) != v.charAt(index)) {
            return index;
        }
        return indexOfNextDifferentChar(index + 1);
    }

    return indexOfNextDifferentChar(1);

}

const findAdjacentGroups = (v) => {
    if (v === '') {
        return [];
    }

    const nextGroupIndex = indexOfNextGroup(v);

    const firstGroup = v.substring(0, nextGroupIndex);
    const nextGroups = findAdjacentGroups(v.substring(nextGroupIndex));
    return [firstGroup, ...nextGroups]
        .filter(g => g.length >= 2);
};

const theTwoAdjacentNumbersAreNotPartsOfALargerGroup = (v) => {
    const value = v.toString();

    const adjacentGroups = findAdjacentGroups(value);

    return adjacentGroups.some(ag => ag.length == 2);
};

// Part 1
const count = [...range(min, max)]
    .filter(containsTwoAdjacentNumbers)
    .filter(neverDecreasing)
    .length

console.log(count);

// Part 2

const count2 = [...range(min, max)]
    .filter(containsTwoAdjacentNumbers)
    .filter(neverDecreasing)
    .filter(theTwoAdjacentNumbersAreNotPartsOfALargerGroup)
    .length;


console.log(count2);