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
    let key;
    for (let i = 0; i < len; i += 1) {
        key = path[i];
        it = getter(key, it, BRK);
        if (it === BRK) { return alt; }
    }
    return it;
}

const isArray = Array.isArray;

export function get(path, obj, alt) {
    return isArray(path)
        ? walk(get1, path, obj, alt)
        : get1(path, obj, alt);
}

export function own(path, obj, alt) {
    return isArray(path)
        ? walk(own1, path, obj, alt)
        : own1(path, obj, alt);
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
    const pathStr = path.join(' > ');
    const message = `${key} is not defined in ${pathStr} @ ${pathIndex}`;
    const err = new ReferenceError(message);
    throw Object.assign(err, {current, key, root, path, pathIndex, args});
}

export function walkAndSet(getter, fn, path, obj, ...args) {
    const len = path.length;
    let current, key;
    for (let i = 0, it = obj; i < len; i += 1) {
        key = path[i];
        current = it;
        it = getter(key, it, BRK);
        if (it === BRK) { return error(current, key, obj, path, i, args); }
    }
    current[key] = fn(current[key], ...args);
    return obj;
}

export function set(path, obj, val) {
    return isArray(path)
        ? walkAndSet(get1, () => val, path, obj)
        : set1(path, obj, val);
}

export function map(fn, path, obj, ...args) {
    return isArray(path)
        ? walkAndSet(get1, fn, path, obj, ...args)
        : map1(fn, path, obj, ...args);
}

////////////////////////////////////////////////////////////////////////////////

export function prop(getFn, setFn) {
    return (obj, ...vals) => arguments.length > 1
        ? setFn(obj, ...vals)
        : getFn(obj);
}
