import R = require("ramda");

export type EmptyTree = { value: undefined, children: []; };
export type Node<T> = { value: T, children: Node<T>[]; }
export type Tree<T> = EmptyTree | Node<T>;

export const createNode = <T>(value: T) => {
    return {value: value, children: []} as Node<T>
}
export const singletonTree = createNode;
export const isEmptyTree = <T>(tree: Tree<T>) => {
    return tree.value == undefined;
}
export const containsNodes = R.complement(isEmptyTree)
export const appendChild = <T>(node: Tree<T>, child: T) => {
    if (isEmptyTree(node)) {
        return singletonTree(child);
    }

    const newNode = createNode(child);
    return {
        ...node,
        children: R.append(newNode, node.children),
    };
};
export const insertIntoTree = R.curry((<T>(tree: Tree<T>, pc: [T, T]) => {
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
export const getLeafs: <T>(tree: Tree<T>) => (Node<T>[]) = R.curry(<T>(tree: Tree<T>) => {
    if (R.isEmpty(tree.children)) {
        return tree;
    }

    return R.flatten(R.map(getLeafs, tree.children));
});


export const containsNodeWithValue = R.curry(<T>(v: T, node: Node<T>) => {
    if (node.value === v) {
        return true;
    }

    return R.complement(R.isEmpty)(node.children) && R.any(containsNodeWithValue(v), node.children);
});


export const ancestorsOf = R.curry(<T>(v: T, node: Node<T>) => {
    if (node.value === v) {
        return [];
    }
    return R.flatten(R.append(ancestorsOf(v, R.find(containsNodeWithValue(v), node.children)), [node.value]));

});