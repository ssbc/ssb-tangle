const test = require('tape')
const get = require('lodash.get')
const { Map, ReverseMap } = require('../../graph/maps.js')

const getThread = node => node.thread

test('Map: linear', t => {
  //    A   (root)
  //    |
  //    B
  //    |
  //    C

  const A = { key: 'A', thread: { root: null, previous: null } }
  const B = { key: 'B', thread: { root: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { root: 'A', previous: ['B'] } }

  const expectedMap = {
    A: { B: 1 },
    B: { C: 1 }
  }

  t.deepEqual(Map([A, B, C], getThread), expectedMap, 'simple linear')
  t.deepEqual(Map([C, B], getThread), expectedMap, 'simple linear (order agnostic)')

  // ## message in-thread but "dangling" (doesn't link up to known messages)
  //
  t.end()
})

test('Map: merge', t => {
  //     A   (root)
  //    / \
  //   B   C
  //    \ /
  //     D

  const A = { key: 'A', thread: { root: null, previous: null } }
  const B = { key: 'B', thread: { root: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { root: 'A', previous: ['A'] } }
  const D = { key: 'D', thread: { root: 'A', previous: ['B', 'C'] } }

  const map = Map([A, D, B, C], getThread)

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
  //    A   (root)
  //    |
  //    B     ----?--- J? (a message we don't have)
  //    |              |
  //    C              K

  const A = { key: 'A', thread: { root: null, previous: null } }
  const B = { key: 'B', thread: { root: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { root: 'A', previous: ['B'] } }
  const K = { key: 'K', thread: { root: 'A', previous: ['J'] } }

  const expectedMap = {
    A: { B: 1 },
    B: { C: 1 },
    J: { K: 1 }
  }
  t.deepEqual(Map([A, B, C, K], getThread), expectedMap, 'dangles')

  t.end()
})

test('Map: non-thread dangles', t => {
  //    A (root)           R?  (root, some other thread)
  //    |                   ?
  //    B                   S (a message we don't have)
  //    |                   |
  //    C                   Q

  const A = { key: 'A', thread: { root: null, previous: null } }
  const B = { key: 'B', thread: { root: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { root: 'A', previous: ['B'] } }
  const Q = { key: 'Q', thread: { root: 'R', previous: ['S'] } }

  const expectedMap = {
    A: { B: 1 },
    B: { C: 1 },
    S: { Q: 1 }
  }

  t.deepEqual(Map([A, B, C, Q], getThread), expectedMap, 'out of thread messages')
  t.end()
})

test('Map: complex merge', t => {
  //      A  (root)
  //     / \
  //    B   C
  //   /   / \
  //  D   E   F
  //   \ /     \
  //    H       G
  //    |
  //    I

  const A = { key: 'A', thread: { root: null, previous: null } }
  const B = { key: 'B', thread: { root: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { root: 'A', previous: ['A'] } }
  const D = { key: 'D', thread: { root: 'A', previous: ['B'] } }
  const E = { key: 'E', thread: { root: 'A', previous: ['C'] } }
  const F = { key: 'F', thread: { root: 'A', previous: ['C'] } }
  const H = { key: 'H', thread: { root: 'A', previous: ['D', 'E'] } }
  const G = { key: 'G', thread: { root: 'A', previous: ['F'] } }
  const I = { key: 'I', thread: { root: 'A', previous: ['H'] } }

  const expectedMap = {
    A: { B: 1, C: 1 },
    B: { D: 1 },
    C: { E: 1, F: 1 },
    D: { H: 1 },
    E: { H: 1 },
    F: { G: 1 },
    H: { I: 1 }
  }

  t.deepEqual(Map([A, B, C, C, D, E, F, G, G, H, I], getThread), expectedMap, 'ugly graph')

  t.end()
})

test('Map: custom thread path', t => {
  //      A  (root)
  //     / \
  //    B   C

  const A = {
    key: 'A',
    threads: {
      gathering: { root: null, previous: null }
    }
  }
  const B = { key: 'B', threads: { gathering: { root: 'A', previous: ['A'] } } }
  const C = { key: 'C', threads: { gathering: { root: 'A', previous: ['A'] } } }

  const expectedMap = {
    A: { B: 1, C: 1 }
  }

  const getThread = node => get(node, 'threads.gathering')
  t.deepEqual(Map([A, B, C], getThread), expectedMap, 'custom thread path')

  t.end()
})
