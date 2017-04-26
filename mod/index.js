/* eslint no-confusing-arrow: 'off' */

const isArray = Array.isArray;

////////////////////////////////////////////////////////////////////////////////

import {walk, get1, own1} from './private';

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

import {walkAndSet, set1, map1} from './private';

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
