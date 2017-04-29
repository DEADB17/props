import {test} from 'tape';
import {error} from './mod/private';
import {get1, own1, walk, get, set, map, prop} from './mod/';

function inAndOwn(fn, str, cons) {
    const name = fn.name;
    test(`${name} accessing ${str} property`, t => {
        t.is(fn('key', cons({key: 'expected'})),
             'expected',
             `${name} gets existing key`);

        const unObj = cons({key: 'unexpected'});
        t.is(fn('key2', unObj),
             undefined,
             `${name} returns undefined for missing key`);
        t.is(fn('key2', unObj, 'expected'),
             'expected',
             `${name} returns alt for missing key when provided`);

        t.is(fn(0, cons(['expected'])),
             'expected',
             `${name} gets existing array index`);

        const unArray = cons(['unexpected']);
        t.is(fn(1, unArray),
             undefined,
             `${name} returns undefined for missing array index`);
        t.is(fn(1, unArray, 'expected'),
             'expected',
             `${name} returns alt for missing array index when provided`);
        t.end();
    });
}

function onlyOwn(fn) {
    const name = fn.name;
    const str = 'prototype';
    const cons = Object.create;
    test(`${name} accessing ${str} property`, t => {
        const unObj = cons({key: 'unexpected'});
        t.is(fn('key', unObj),
             undefined,
             `${name} returns undefined for existing key in the prototype`);
        t.is(fn('key', unObj, 'expected'),
             'expected',
             `${name} returns alt for for existing key in the prototype when provided`);

        const unArray = cons(['unexpected']);
        t.is(fn(1, unArray),
             undefined,
             `${name} returns undefined for existing array index in the prototype`);
        t.is(fn(1, unArray, 'expected'),
             'expected',
             `${name} returns alt for existing array index in the prototype when provided`);
        t.end();
    });
}

function id(it) { return it; }

inAndOwn(get1, 'own', id);
inAndOwn(get1, 'prototype', Object.create);

inAndOwn(own1, 'own', id);
onlyOwn(own1);

test('set object', t => {
    const obj = {key: 'original'};
    t.same(
        set('key', obj, 'new'),
        {key: 'new'},
        'sets a new value');
    t.same(
        set('key2', obj, 'new'),
        {key: 'new', key2: 'new'},
        'adds a new value');

    const original = {key: 'original'};
    const proto = Object.create(original);
    set('key', proto, 'new');
    t.same(proto,
           {key: 'new'},
           'adds a new value to the base object');
    t.same(Object.getPrototypeOf(proto),
           original,
           'does not change the object\'s prototype');
    t.end();
});

test('set array', t => {
    const obj = ['original'];
    t.same(set(0, obj, 'new'),
           ['new'],
           'sets a new value');
    t.same(set(1, obj, 'new'),
           ['new', 'new'],
           'adds a new value');

    const original = ['original'];
    const proto = Object.create(original);
    set(0, proto, 'new');
    t.same(proto,
           ['new'],
           'adds a new value to the base array');
    t.same(Object.getPrototypeOf(proto),
           original,
           'does not change the array\'s prototype');
    t.end();
});

test('ro - read only property', t => {
    const obj = {a: {b: [{ c: {original: 'original'}}]}};

    t.is(ro(['a', 'b', 0, 'c', 'original'], obj, get)(),
         'original',
         'long mixed path');

    t.same(ro(['a'], obj, get)(),
           {b: [{ c: {original: 'original'}}]},
           'one element path');

    t.same(ro('a', obj, get)(),
           {b: [{ c: {original: 'original'}}]},
           'string key');

    t.end();
});

test('wo - write only property', t => {
    const obj = {a: {b: [{ c: {original: 'original'}}]}};
    const wop = wo(['a', 'b', 0, 'c', 'original'], obj, get);
    const expected = {a: {b: [{ c: {original: 'modified'}}]}};
    t.same(wop('modified'), expected);
    t.end();
});

////////////////////////////////////////////////////////////////////////////////

test.only('x', t => {
    const state = {
        model: {
            path: ['none'],
            visibility: 'closed',
            options: ['empty', null, null],
        },
        net: {
            pending: {},
        },
        dom: {
            temp: null,
        }
    };

    const mpath = prop(
        root => root.model.path,
        (root, ...items) => {
            root.model.path.push(...items);
            return root;
        });

    const mvis = prop(
        root => root.model.visibility,
        (root, val) => {
            root.model.visibility = val;
            return root;
        });

    mpath(state, 'test', 1, 2, 7);

    t.same(mpath(state), ['none', 'test', 1, 2, 7]);
    t.same(mvis(state, 'opened').model.visibility, 'opened');
    // t.same()
    t.end();
});
