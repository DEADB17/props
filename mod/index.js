// TODO(leo): add owns, has, safe gets

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
