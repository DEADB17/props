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
// safe getters

/**
 * A unique value representing nothing. Used as a sentinel since `null` and
 * `undefined` are valid possible values.
 *
 * @const {Object}
 */
export const NONE = Object.freeze(Object.create(null));

/**
 * Searches a possibly nested set of containers (Objects and Arrays) using the
 * provided list of keys, returning the value of the last key or the optional
 * alternative. The existence of the keys is tested using `in`.
 *
 * @arg {...(string|number)} path The sequence of keys to search in.
 * @returns {safeGetter} A function to be invoked with the target object and an
 * optional return value.
 */
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

/**
 * A function to be invoked with the target container and an optional return
 * value used when no value was found.
 *
 * @callback safeGetter
 * @arg {(Object|Array)} root The root container.
 * @arg {*} [alt=NONE] An alternative to use if nothing was found.
 * @returns {*} The value found or the alternative.
 */

/**
 * Searches a possibly nested set of containers (Objects and Arrays) using the
 * provided list of keys, returning the value of the last key or the optional
 * alternative. The existence of the keys is tested using `hasOwnProperty`.
 *
 * @arg {...(string|number)} path The sequence of keys to search in.
 * @returns {safeGetter} A function to be invoked with the target object and an
 * optional return value.
 */
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

/**
 * Defines a getter by pre-specifying the key to use for lookups on containers
 * (Objects and Arrays).
 *
 * @arg {...(string|number)} key An string or an integer.
 * @returns {getter} A function to be invoked with the instance of the container
 * to perform the look-up.
 */
export function makeGet(key) {
    if (arguments.length !== 1) {
        throw new TypeError('makeGet requires 1 argument');
    }
    return function get(root) { return root[key]; };
}

/**
 * A function to be invoked with the target container.
 *
 * @callback getter
 * @arg {(Object|Array)} root The root container.
 * @returns {*} The value found or `undefined`.
 */

/**
 * Defines a setter by pre-specifying the key to use for assignment on containers
 * (Objects and Arrays).
 *
 * @arg {...(string|number)} key An string or an integer.
 * @returns {setter} A function to be invoked with the instance of the container
 * to perform the assignment and a value to be assigned.
 */
export function makeSet(key) {
    if (arguments.length !== 1) {
        throw new TypeError('makeSet requires 1 argument');
    }
    return function set(root, val) {
        root[key] = val;
        return root;
    };
}

/**
 * A function to be invoked with the instance of the container to perform the
 * assignment and a value to be assigned.
 *
 * @callback setter
 * @arg {(Object|Array)} root The root container.
 * @arg {*} val The value to assign.
 * @returns {*} The root container.
 */

/**
 * Defines a *prop* (getter *and* setter) by pre-specifying the key to use for
 * lookup and assignment on containers (Objects and Arrays).
 *
 * @arg {...(string|number)} key An string or an integer.
 * @returns {prop} A function to be invoked as *getter or *setter* depending on
 * whether or not a value is provided in addition to the container.
 */
export function makeProp(key) {
    if (arguments.length !== 1) {
        throw new TypeError('makeProp requires 1 argument');
    }
    return function prop(root, val) {
        if (arguments.length <= 1) { return root[key]; }
        root[key] = val;
        return root;
    };
}

/**
 * A function to be invoked as *getter or *setter* depending on whether or not a
 * value is provided in addition to the container
 *
 * @callback prop
 * @arg {(Object|Array)} root The root container.
 * @arg {*} [val] An optional value to assign.
 * @returns {*} The current value, or the root container.
 */

    };
}
