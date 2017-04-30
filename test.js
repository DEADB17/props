/* eslint no-magic-numbers: off, no-shadow: off */

import {test} from 'tape';

function argLen(n) { return n === 1 ? 'one argument' : `${n} arguments`; }

function makeSampleObject() {
    return {
        a: {
            b: {c: 'c', d: 'd'},
            e: [10, 11, 12],
        },
        f: [
            {g: 'g', h: 'h'},
            [20, 21, 22],
        ],
    };
}

function makeSampleArray() {
    return [
        {
            b: {c: 'c', d: 'd'},
            e: [10, 11, 12],
        },
        [
            {g: 'g', h: 'h'},
            [20, 21, 22],
        ],
    ];
}


////////////////////////////////////////////////////////////////////////////////

import {makeSafeGet, makeSafeOwn} from './mod/';

function testSafeBasics(maker, outLen) {
    test(maker.name, t => {
        t.ok(typeof maker === 'function', 'is a function');
        t.is(maker.length, 0, `it takes at least ${argLen(1)}`);
        t.throws(() => maker(), TypeError, 'with fewer arguments it throws a TypeError');
        t.doesNotThrow(() => maker(1, 2, 3, 4), 'extra arguments are accepted');

        t.test(`calling ${maker.name}`, t => {
            const ap = maker('a');

            t.ok(typeof ap === 'function', 'it returns a function');
            t.is(ap.length, outLen, `it returns a function of ${argLen(outLen)}`);
            t.end();
        });
        t.end();
    });
}

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

testSafeBasics(makeSafeGet, 1);
testSafeBasics(makeSafeOwn, 1);

// inAndOwn(makeSafeGet, 'own', id);
// inAndOwn(makeSafeGet, 'prototype', Object.create);

// inAndOwn(makeSafeOwn, 'own', id);
// onlyOwn(makeSafeOwn);


////////////////////////////////////////////////////////////////////////////////

import {makeGet, makeSet, makeProp} from './mod/';

function testBasics(maker, inLen, outLen) {
    test(maker.name, t => {
        t.ok(typeof maker === 'function', 'is a function');
        t.is(maker.length, inLen, `takes ${argLen(inLen)}`);
        t.throws(() => maker(), TypeError, 'with fewer arguments throws a TypeError');
        t.throws(() => maker(1, 2, 3, 4), TypeError, 'with extra arguments throws a TypeError');

        t.test(`calling ${maker.name}`, t => {
            const ap = maker('a');

            t.ok(typeof ap === 'function', 'returns a function');
            t.is(ap.length, outLen, `returns a function of ${argLen(outLen)}`);
            t.end();
        });
        t.end();
    });
}

function testGetter(maker) {
    test(`applying the function returned from ${maker.name}`, t => {
        t.same(maker('a')(makeSampleObject()),
               makeSampleObject().a,
               'to an object that contains the key returns its value');
        t.same(maker(1)(makeSampleArray()),
               makeSampleArray()[1],
               'to an array that contains the index returns its value');
        t.throws(() => maker('z')(),
                 TypeError,
                 'throws a TypeError if the element is missing');
        t.end();
    });
}

function testSetter(maker) {
    test(`applying the function returned from ${maker.name}`, t => {
        const expectObj = makeSampleObject();
        expectObj.a = 'EXPECTED';
        t.same(maker('a')(makeSampleObject(), 'EXPECTED'),
               expectObj,
               'to an object that contains the key sets its value and returns the object');

        const expectAry = makeSampleArray();
        expectAry[1] = 'EXPECTED';
        t.same(maker(1)(makeSampleArray(), 'EXPECTED'),
               expectAry,
               'to an array that contains the index sets its value and returns the array');
        t.throws(() => maker('z')(),
                 TypeError,
                 'throws a TypeError if the element is missing');
        t.end();
    });
}

testBasics(makeGet, 1, 1);
testGetter(makeGet);

testBasics(makeSet, 1, 2);
testSetter(makeSet);

testBasics(makeProp, 1, 2);
testGetter(makeProp);
testSetter(makeProp);
