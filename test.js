/* eslint no-magic-numbers: off, no-shadow: off */

import {test} from 'tape';
import {makeGet, makeSet, makeProp} from './mod/';

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

function testBasics(maker, inLen, outLen) {
    test(maker.name, t => {
        t.ok(typeof maker === 'function', 'is a function');
        t.is(maker.length, inLen, `takes ${argLen(inLen)}`);

        t.test(`calling ${maker.name}`, t => {
            const ap = maker('a');

            t.ok(typeof ap === 'function', 'returns a function');
            t.is(ap.length, outLen, `returns a function of ${argLen(outLen)}`);
            t.throws(() => maker(), TypeError, 'with fewer arguments throws a TypeError');
            t.throws(() => maker(1, 2, 3, 4), TypeError, 'with extra arguments throws a TypeError');
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
