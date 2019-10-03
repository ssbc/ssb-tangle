const test = require('tape')
const get = require('lodash.get')
const { Map, ReverseMap } = require('../../../lib/graph/maps.js')

test('Map: linear', t => {
  //    A   (first)
  //    |
  //    B
  //    |
  //    C

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['B'] } }

  const expectedMap = {
    A: { B: 1 },
    B: { C: 1 }
  }

  t.deepEqual(Map([A, B, C]), expectedMap, 'simple linear')
  t.deepEqual(Map([A, C, B]), expectedMap, 'simple linear (order agnostic)')

  // ## message in-thread but "dangling" (doesn't link up to known messages)
  //
  t.end()
})

test('Map: merge', t => {
  //     A   (first)
  //    / \
  //   B   C
  //    \ /
  //     D

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['A'] } }
  const D = { key: 'D', thread: { first: 'A', previous: ['B', 'C'] } }

  const map = Map([A, D, B, C])

  const expectedMap = {
    A: { B: 1, C: 1 },
    B: { D: 1 },
    C: { D: 1 }
  }

  t.deepEqual(map, expectedMap, 'happy')
  t.end()
})
test('ReverseMap: merge', t => {
  const map = {
    A: { B: 1, C: 1 },
    B: { D: 1 },
    C: { D: 1 }
  }

  const expectedRevserseMap = {
    D: { B: 1, C: 1 },
    C: { A: 1 },
    B: { A: 1 }
  }
  t.deepEqual(ReverseMap(map), expectedRevserseMap, 'happy')
  t.end()
})

test('Map: dangle', t => {
  //    A   (first)
  //    |
  //    B     ----?--- J? (a message we don't have)
  //    |              |
  //    C              K

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['B'] } }
  const K = { key: 'K', thread: { first: 'A', previous: ['J'] } }

  const expectedMap = {
    A: { B: 1 },
    B: { C: 1 },
    J: { K: 1 }
  }
  t.deepEqual(Map([A, B, C, K]), expectedMap, 'dangles')

  t.end()
})

test('Map: non-thread dangles', t => {
  //    A (first)           R?  (first, some other thread)
  //    |                   ?
  //    B                   S (a message we don't have)
  //    |                   |
  //    C                   Q

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['B'] } }
  const Q = { key: 'Q', thread: { first: 'R', previous: ['S'] } }

  const expectedMap = {
    A: { B: 1 },
    B: { C: 1 },
    S: { Q: 1 }
  }

  t.deepEqual(Map([A, B, C, Q]), expectedMap, 'out of thread messages')
  t.end()
})

test('Map: complex merge', t => {
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

  const expectedMap = {
    A: { B: 1, C: 1 },
    B: { D: 1 },
    C: { E: 1, F: 1 },
    D: { H: 1 },
    E: { H: 1 },
    F: { G: 1 },
    H: { I: 1 }
  }

  t.deepEqual(Map([A, B, C, C, D, E, F, G, G, H, I]), expectedMap, 'ugly graph')

  t.end()
})

test('Map: custom thread path', t => {
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

  const expectedMap = {
    A: { B: 1, C: 1 }
  }

  // const getThead = node => node.threads.gathering
  const getThead = node => get(node, 'threads.gathering')
  t.deepEqual(Map([A, B, C], getThead), expectedMap, 'custom thread path')

  t.end()
})
