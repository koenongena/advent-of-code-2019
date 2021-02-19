import R = require("ramda");
import {readLinesForDay} from "./input";
import {
    appendChild,
    containsNodeWithValue,
    containsNodes,
    getLeafs,
    insertIntoTree,
    isEmptyTree,
    Node,
    singletonTree,
    Tree, ancestorsOf
} from "./tree";

export type ParentChild = [string, string];


const findRoot = (pairs) => {
    const l = R.map(p => p[0], pairs);
    const r = R.map(p => p[1], pairs);

    const nonMutual = R.head(R.difference(l, r));
    return R.find(p => p[0] === nonMutual, pairs);
}
// const appendPairs = (tree: Node<string>, remaining: ParentChild[]) => {
//     const leafs = R.map(R.prop("value"), getLeafs(tree));
//     const p = ([r, _]) => R.includes(r, leafs);
//     const newLeafs = R.filter(p, remaining);
//     return R.reduce(insertIntoTree, tree, newLeafs);
// };


const buildTree: (pairs) => Tree<string> = (pairs: ParentChild[]) => {

    const root = findRoot(pairs);
    let remaining = R.filter(p => p[0] !== root[0], pairs);
    let tree = appendChild(singletonTree(root[0]), root[1]);

    const isNotEmpty = R.complement(R.isEmpty);
    while (isNotEmpty(remaining)) {
        const leafs = R.map(R.prop("value"), getLeafs(tree));
        const p = ([r, _]) => R.includes(r, leafs);
        const newLeafs = R.filter(p, remaining);
        remaining = R.filter(R.complement(p), remaining);
        tree = R.reduce(insertIntoTree, tree, newLeafs);
    }

    return tree;
};

const nodesAtDepth = R.curry(<T>(depth: number, tree: Tree<T>) => {
    if (isEmptyTree(tree)) {
        return 0;
    } else if (depth === 0 && containsNodes(tree)) {
        return 1;
    }
    return R.sum(R.map(nodesAtDepth(depth - 1), tree.children));
});

const depth = <T>(tree: Tree<T>) => {
    if (isEmptyTree(tree)) {
        return 0;
    } else if (R.isEmpty(tree.children)) {
        return 1;
    }

    return 1 + R.apply(Math.max, R.map(depth, tree.children));
}

(async () => {
    const pairs = await R.pipe(
        readLinesForDay,
        R.andThen(R.map(R.split('\)')))
    )(6);

    const tree = buildTree(pairs);
    const orbitCountAtDepth = (d) => d * nodesAtDepth(d, tree);

    const determineOrbitCount = R.pipe(
        depth,
        R.range(1),
        R.map(orbitCountAtDepth),
        R.sum
    );
    console.log(determineOrbitCount(tree));

    const santaAncestors = ancestorsOf("SAN", tree);
    const myAncestors = ancestorsOf("YOU", tree);
    const mutualAncestors = R.intersection(santaAncestors, myAncestors);
    console.log(santaAncestors.length - mutualAncestors.length + myAncestors.length - mutualAncestors.length)
})();