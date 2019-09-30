const test = require('tape')
const ReverseMap = require('../lib/build-reverse-edge-map')

test('build-reverse-edge-map: merge', t => {
  //     A   (first)
  //    / \
  //   B   C
  //    \ /
  //     D

  const map = {
    A: { B: 1, C: 1 },
    B: { D: 1 },
    C: { D: 1 }
  }

  const expected = {
    D: { B: 1, C: 1 },
    C: { A: 1 },
    B: { A: 1 }
  }

  t.deepEqual(ReverseMap(map), expected, 'happy')
  t.end()
})
