import R = require("ramda");
import {readFileContentForDay, readLinesForDay} from "./input";
import {KeyValuePair} from "ramda";

type EmptyTree = { value: undefined, children: []; };
type Node<T> = { value: T, children: Node<T>[]; }
type Tree<T> = EmptyTree | Node<T>;
type ParentChild = [string, string];

const createNode = <T>(value: T) => {
    return {value: value, children: []} as Node<T>
}
const singletonTree = createNode;

const isEmpty = <T>(tree: Tree<T>) => {
    return tree.value == undefined;
}

const appendChild = (node: Tree<string>, child: string) => {
    if (isEmpty(node)) {
        return singletonTree(child);
    }

    const newNode = createNode(child);
    return {
        ...node,
        children: R.append(newNode, node.children),
    };
};

const insertIntoTree = R.curry(((tree: Tree<string>, pc: ParentChild) => {
    const [parent, child] = pc;
    if (tree.value == parent) {
        return appendChild(tree, child);
    }

    return {
        value: tree.value,
        children: R.map(R.curry(insertIntoTree(R.__, pc)), tree.children)
    }
}));


/**
 * Returns a list of nodes
 */
const getLeafs: (tree: Tree<string>) => (Node<string>[]) = R.curry((tree: Tree<string>) => {
    if (R.isEmpty(tree.children)) {
        return tree;
    }

    return R.flatten(R.map(getLeafs, tree.children));
});

const findRoot = (pairs) => {
    const l = R.map(p => p[0], pairs);
    const r = R.map(p => p[1], pairs);

    const nonMutual = R.head(R.difference(l, r));
    return R.find(p => p[0] === nonMutual, pairs);
}

const buildTree: (pairs) => Tree<string> = (pairs: ParentChild[]) => {

    const root = findRoot(pairs);
    let remaining = R.filter(p => p[0] !== root[0],pairs);
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

(async () => {
    const pairs = await R.pipe(
        readLinesForDay,
        R.andThen(R.map(R.split('\)')))
    )(6);

    const tree = buildTree(pairs);
    console.log(JSON.stringify(tree));
})();