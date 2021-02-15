import R = require("ramda");

export const pow = R.curry(R.flip(Math.pow));
export const sqr = pow(2);
export const sqrt = Math.sqrt;