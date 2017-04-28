/* eslint no-confusing-arrow: 'off' */

export function get1(key, obj, alt) {
    return key in obj ? obj[key] : alt;
}

const hasOwn = Object.prototype.hasOwnProperty;

export function own1(key, obj, alt) {
    return hasOwn.call(obj, key) ? obj[key] : alt;
}

const BRK = {};

export function walk(getter, path, obj, alt) {
    const len = path.length;
    let it = obj;
    for (let i = 0, key; i < len; i += 1) {
        key = path[i];
        it = getter(key, it, BRK);
        if (it === BRK) { return alt; }
    }
    return it;
}


////////////////////////////////////////////////////////////////////////////////

export function set1(key, obj, val) {
    obj[key] = val;
    return obj;
}

export function map1(fn, key, obj, ...args) {
    obj[key] = fn(obj[key], ...args);
    return obj;
}

export function error(current, key, root, path, pathIndex, args) {
    const pathStr = path.join(', ');
    const message = `${key} is not defined in [${pathStr}][${pathIndex}]`;
    const err = new ReferenceError(message);
    return Object.assign(err, {current, key, root, path, pathIndex, args});
}

export function walkAndSet(getter, fn, path, obj, ...args) {
    const len = path.length;
    let container, key;
    for (let i = 0, val = obj; i < len; i += 1) {
        key = path[i];
        container = val;
        val = getter(key, val, BRK);
        if (val === BRK) { throw error(container, key, obj, path, i, args); }
    }
    container[key] = fn(container[key], ...args);
    return obj;
}
