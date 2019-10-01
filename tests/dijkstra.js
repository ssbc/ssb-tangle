const test = require('tape')
const {
  longestPathLength,
  longestPath,
  buildLongestPathMap
} = require('../lib/dijkstra')

test('dijkstra: simple', t => {
  //     A  (first)
  //    / \
  //   B   C
  //   |   |
  //   |   D
  //    \ / \
  //     E   F

  const edgeMap = {
    A: { B: 1, C: 1 },
    B: { E: 1 },
    C: { D: 1 },
    D: { E: 1, F: 1 }
  }

  t.equal(longestPathLength(edgeMap, 'A', 'D'), 2)
  t.equal(longestPathLength(edgeMap, 'A', 'E'), 3)
  t.equal(longestPathLength(edgeMap, 'A', 'F'), 3)

  t.deepEqual(longestPath(edgeMap, 'A', 'E'), ['A', 'C', 'D', 'E'])

  const dmap = buildLongestPathMap(edgeMap, 'A')

  t.equal(longestPathLength(edgeMap, 'A', 'E', { dmap }), 3)
  t.deepEqual(longestPath(edgeMap, 'A', 'E', { dmap }), ['A', 'C', 'D', 'E'])

  t.end()
})

test('dijkstra: more complex', t => {
  //     A  (first)
  //    / \
  //   B   C
  //   |  /|\
  //   | D E F
  //   | | | |
  //   | G \ /
  //   \ /  H
  //    I  /
  //    | /
  //    J/

  const edgeMap = {
    A: { B: 1, C: 1 },
    B: { I: 1 },
    I: { J: 1 },
    C: { D: 1, E: 1, F: 1 },
    D: { G: 1 },
    G: { I: 1 },
    E: { H: 1 },
    F: { H: 1 },
    H: { J: 1 }
  }

  const dmap = buildLongestPathMap(edgeMap, 'A')

  t.equal(longestPathLength(edgeMap, 'A', 'J', { dmap }), 5)
  t.deepEqual(longestPath(edgeMap, 'A', 'J', { dmap }), ['A', 'C', 'D', 'G', 'I', 'J'])

  t.end()
})
