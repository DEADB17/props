/* eslint no-confusing-arrow: 'off' */

export function get1(key, obj, alt) {
    return key in obj ? obj[key] : alt;
}

const hasOwn = Object.prototype.hasOwnProperty;

export function own1(key, obj, alt) {
    return hasOwn.call(obj, key) ? obj[key] : alt;
}


////////////////////////////////////////////////////////////////////////////////

const BRK = {};

export function walk(getFn, path, root, esc, alt) {
    const len = path.length;
    let obj = root;
    for (let i = 0; i < len; i += 1) {
        obj = getFn(path[i], obj, BRK);
        if (obj === BRK) { return esc(alt, root, path, i); }
    }
    return obj;
}


////////////////////////////////////////////////////////////////////////////////

function id(val) { return val; }

export function get(path, getFn, alt) {
    const isArray = Array.isArray(path);
    return function getter(root) {
        return isArray ? walk(getFn, path, root, id, alt) : getFn(path, root, alt);
    };
}

import {error} from './private';

export function set(path, getFn) {
    const len = path.length - 1;
    const isArray = Array.isArray(path);
    const key = isArray ? path[len] : path;
    const shortPath = isArray ? path.slice(0, len) : null;
    return function setter(root, val) {
        const obj = isArray ? walk(getFn, shortPath, root, error) : root;
        obj[key] = val;
        return root;
    };
}

export function map(path, getFn, setFn) {
    const len = path.length - 1;
    const isArray = Array.isArray(path);
    const key = isArray ? path[len] : path;
    const shortPath = isArray ? path.slice(0, len) : null;
    return function mapper(root, ...args) {
        const obj = isArray ? walk(getFn, shortPath, root, error) : root;
        setFn(obj[key], ...args);
        return root;
    };
}

export function prop(getFn, setFn) {
    return function propper(root, ...args) {
        return arguments.length > 1 ? setFn(root, ...args) : getFn(root);
    };
}
