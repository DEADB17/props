import {test} from 'tape';
import {get1, own1} from './mod/private';
import {get, own, set, map} from './mod/';

function basic(fn, str, cons) {
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

// function basic(fn, str, cons) {
//     const name = fn.name;
//     test(`${name} accessing ${str} property`, t => {
//         t.is(fn('key', cons({key: 'expected'})),
//              'expected',
//              `${name} gets existing key`);
//         t.end();
//     });
// }

function id(it) { return it; }

basic(get1, 'get', id);
basic(get1, 'prototype', Object.create);

basic(own1, 'own', id);

basic(get, 'get', id);
basic(get, 'prototype', Object.create);

basic(own, 'own', id);


test('set', t => {
    const obj = {a: {b: [{ c: {original: 'original'}}]}};
    t.same(set(['a', 'b', 0, 'c', 'original'], obj, 'new'),
         {a: {b: [{ c: {original: 'new'}}]}},
         'sets a new value at the right entry');
    t.end();
});

test('map', t => {
    const obj = {a: {b: [{ c: {original: 'original'}}]}};
    const fn = (old, newv, extra, param) => `${old} + ${newv} + ${extra} + ${param}`;
    t.same(map(fn, ['a', 'b', 0, 'c', 'original'], obj, 'new', 'extra', 'param'),
         {a: {b: [{ c: {original: 'original + new + extra + param'}}]}},
         'maps a new value at the right entry');
    t.end();
});
