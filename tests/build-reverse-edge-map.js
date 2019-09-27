const test = require('tape')
const Map = require('../lib/build-reverse-edge-map')

test('build-reverse-edge-map: merge', t => {
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
    D: { B: 1, C: 1 },
    C: { A: 1 },
    B: { A: 1 }
  }

  t.deepEqual(Map([A, D, B, C]), expected, 'happy')
  t.end()
})
