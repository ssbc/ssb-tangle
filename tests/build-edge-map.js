const test = require('tape')
const get = require('lodash.get')
const Map = require('../lib/build-edge-map')

test('build-edge-map: linear', t => {
  //    A   (first)
  //    |
  //    B
  //    |
  //    C

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['B'] } }

  const expected = {
    A: { B: 1 },
    B: { C: 1 }
  }

  t.deepEqual(Map([A, B, C]), expected, 'simple linear')
  t.deepEqual(Map([A, C, B]), expected, 'simple linear (order agnostic)')

  // ## message in-thread but "dangling" (doesn't link up to known messages)
  //
  t.end()
})

test('build-edge-map: merge', t => {
  //     A   (first)
  //    / \
  //   B   C
  //    \ /
  //     D

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['A'] } }
  const D = { key: 'D', thread: { first: 'A', previous: ['B', 'C'] } }

  const expected = {
    A: { B: 1, C: 1 },
    B: { D: 1 },
    C: { D: 1 }
  }

  t.deepEqual(Map([A, D, B, C]), expected, 'happy')
  t.end()
})

test('build-edge-map: dangle', t => {
  //    A   (first)
  //    |
  //    B     ----?--- J? (a message we don't have)
  //    |              |
  //    C              K

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['B'] } }
  const K = { key: 'K', thread: { first: 'A', previous: ['J'] } }

  const expected3 = {
    A: { B: 1 },
    B: { C: 1 },
    J: { K: 1 }
  }
  t.deepEqual(Map([A, B, C, K]), expected3, 'dangles')

  t.end()
})

test('build-edge-map: non-thread dangles', t => {
  //    A (first)           R?  (first, some other thread)
  //    |                   ?
  //    B                   S (a message we don't have)
  //    |                   |
  //    C                   Q

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['B'] } }
  const Q = { key: 'Q', thread: { first: 'R', previous: ['S'] } }

  const expected2 = {
    A: { B: 1 },
    B: { C: 1 },
    S: { Q: 1 }
  }

  t.deepEqual(Map([A, B, C, Q]), expected2, 'out of thread messages')
  t.end()
})

test('build-edge-map: complex merge', t => {
  //      A  (first)
  //     / \
  //    B   C
  //   /   / \
  //  D   E   F
  //   \ /     \
  //    H       G
  //    |
  //    I

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['A'] } }
  const D = { key: 'D', thread: { first: 'A', previous: ['B'] } }
  const E = { key: 'E', thread: { first: 'A', previous: ['C'] } }
  const F = { key: 'F', thread: { first: 'A', previous: ['C'] } }
  const H = { key: 'H', thread: { first: 'A', previous: ['D', 'E'] } }
  const G = { key: 'G', thread: { first: 'A', previous: ['F'] } }
  const I = { key: 'I', thread: { first: 'A', previous: ['H'] } }

  const expected2 = {
    A: { B: 1, C: 1 },
    B: { D: 1 },
    C: { E: 1, F: 1 },
    D: { H: 1 },
    E: { H: 1 },
    F: { G: 1 },
    H: { I: 1 }
  }

  t.deepEqual(Map([A, B, C, C, D, E, F, G, G, H, I]), expected2, 'ugly graph')

  t.end()
})

test('build-edge-map: custom thread path', t => {
  //      A  (first)
  //     / \
  //    B   C

  const A = {
    key: 'A',
    threads: {
      gathering: { first: null, previous: null }
    }
  }
  const B = { key: 'B', threads: { gathering: { first: 'A', previous: ['A'] } } }
  const C = { key: 'C', threads: { gathering: { first: 'A', previous: ['A'] } } }

  const expected2 = {
    A: { B: 1, C: 1 }
  }

  // const getThead = node => node.threads.gathering
  const getThead = node => get(node, 'threads.gathering')
  t.deepEqual(Map([A, B, C], getThead), expected2, 'custom thread path')

  t.end()
})
