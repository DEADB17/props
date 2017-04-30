////////////////////////////////////////////////////////////////////////////////
// private

function get1(key, obj, alt) {
    return key in obj ? obj[key] : alt;
}

const hasOwn = Object.prototype.hasOwnProperty;

function own1(key, obj, alt) {
    return hasOwn.call(obj, key) ? obj[key] : alt;
}

const BRK = Object.create(null);

function walk(getter, path, root, alt) {
    const len = path.length;
    let obj = root;
    for (let i = 0; i < len; i += 1) {
        obj = getter(path[i], obj, BRK);
        if (obj === BRK) { return alt; }
    }
    return obj;
}


////////////////////////////////////////////////////////////////////////////////
// safe accessors

export const NONE = Object.freeze(Object.create(null));

export function makeSafeGet(...path) {
    if (arguments.length < 1) {
        throw new TypeError('makeSafeGet requires at least 1 argument');
    }
    if (arguments.length === 1) {
        const key = path[0];
        return function safeGet(root, alt = NONE) { return get1(key, root, alt); };
    }
    return function safeGet(root, alt = NONE) { return walk(get1, path, root, alt); };
}

export function makeSafeOwn(...path) {
    if (arguments.length < 1) {
        throw new TypeError('makeSafeOwn requires at least 1 argument');
    }
    if (arguments.length === 1) {
        const key = path[0];
        return function safeOwn(root, alt = NONE) { return own1(key, root, alt); };
    }
    return function safeOwn(root, alt = NONE) { return walk(own1, path, root, alt); };
}


////////////////////////////////////////////////////////////////////////////////
// getters and setter

export function makeGet(key) {
    if (arguments.length !== 1) {
        throw new TypeError('makeGet requires 1 argument');
    }
    return function get(obj) { return obj[key]; };
}

export function makeSet(key) {
    if (arguments.length !== 1) {
        throw new TypeError('makeSet requires 1 argument');
    }
    return function set(obj, val) {
        obj[key] = val;
        return obj;
    };
}

export function makeProp(key) {
    if (arguments.length !== 1) {
        throw new TypeError('makeProp requires 1 argument');
    }
    return function prop(obj, val) {
        if (arguments.length <= 1) { return obj[key]; }
        obj[key] = val;
        return obj;
    };
}
