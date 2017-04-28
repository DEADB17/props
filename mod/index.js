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


////////////////////////////////////////////////////////////////////////////////

import {error} from './private';

const BRK = {};

export function walk(getter, path, root) {
    const len = path.length;
    let obj = root;
    for (let i = 0; i < len; i += 1) {
        obj = getter(path[i], obj, BRK);
        if (obj === BRK) { throw error(getter, root, path, i); }
    }
    return obj;
}


////////////////////////////////////////////////////////////////////////////////

function destruct(getter, path, root) {
    const len = path.length - 1;
    const isArray = Array.isArray(path);
    return {
        key: isArray ? path[len] : path,
        obj: isArray ? walk(getter, path.slice(0, len), root) : root,
    };
}

export function ro(path, root, getter = get) {
    const {key, obj} = destruct(getter, path, root);
    return function roprop() {
        return getter(key, obj);
    };
}

export function wo(path, root, getter = get) {
    const {key, obj} = destruct(getter, path, root);
    return function woprop(val) {
        if (arguments.length < 1) { throw new Error(`Write only property ${path.join('.')}`); }
        obj[key] = val;
        return root;
    };
}

export function rw(path, root, getter = get) {
    const {key, obj} = destruct(getter, path, root);
    return function rwprop(val) {
        if (arguments.length < 1) { return getter(key, obj); }
        obj[key] = val;
        return root;
    };
}
