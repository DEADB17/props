/* eslint no-confusing-arrow: 'off' */

export function get(key, obj, alt) {
    return key in obj ? obj[key] : alt;
}

const hasOwn = Object.prototype.hasOwnProperty;

export function own(key, obj, alt) {
    return hasOwn.call(obj, key) ? obj[key] : alt;
}


export function set(key, obj, val) {
    obj[key] = val;
    return obj;
}

const BRK = {};

export function walk(getter, err, ok, path, obj, val) {
    const len = path.length;
    let it = obj;
    let key, i;
    for (i = 0; i < len; i += 1) {
        key = path[i];
        it = getter(key, it, BRK);
        if (it === BRK) { break; }
    }
    return (i < len ? err : ok)(it, key, obj, val, i, path);
}

const isArray = Array.isArray;

function id(it) { return it; }

export function gets(path, obj, alt) {
    return isArray(path)
        ? walk(get, () => alt, id, path, obj)
        : get(path, obj, alt);
}

export function owns(path, obj, alt) {
    return isArray(path)
        ? walk(own, () => alt, id, path, obj)
        : own(path, obj, alt);
}

function error(it, key, obj, val, i, path) {
    throw new Error();
}

function set2(it, key, obj, val/* , i, path */) {
    set(key, it, val);
    return obj;
}

export function sets(path, obj, val) {
    return isArray(path)
        ? walk(get, error, set2, path, obj, val)
        : set(path, obj, val);
}

function set3(fn) {
    return (it, key, obj, args/* , i, path */) => {
        fn(it, ...args);
        return obj;
    };
}

export function wrap(fn) {
    return (path, obj, ...args) => isArray(path)
        ? walk(get, error, set3(fn), path, obj, args)
        : set(path, obj, fn(obj[path], ...args));
}



export function prop(path, obj, val) {
    return arguments.length < prop.length
        ? gets(path, obj)
        : sets(path, obj, val);
}

export function ownProp(path, obj, val) {
    return arguments.length < ownProp.length
        ? owns(path, obj)
        : sets(path, obj, val);
}
