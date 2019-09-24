const test = require('tape')
const Graph = require('../lib/build-graph')

test('buildGraph: linear', t => {
  // ## happy case
  //
  //    A   (first)
  //    |
  //    B
  //    |
  //    C

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['B'] } }

  const expected = {
    graph: {
      A: { B: 1 },
      B: { C: 1 }
    },
    nodes: {
      connected: { A, B, C },
      disconnected: {}
    }
  }

  t.deepEqual(Graph(A, [B, C]), expected, 'happy')
  t.deepEqual(Graph(A, [C, B]), expected, 'happy (different order)')
  /// /////////////////////////////////////////////////////////////////

  // ## messages from another threads
  //
  //    A (first)           R?  (first, some other thread)
  //    |                   ?
  //    B                   S (a message we don't have)
  //    |                   |
  //    C                   Q

  const Q = { key: 'Q', thread: { first: 'R', previous: ['S'] } }
  const expected2 = {
    graph: {
      A: { B: 1 },
      B: { C: 1 },
      S: { Q: 1 }
    },
    nodes: {
      connected: { A, B, C },
      disconnected: { Q, S: null }
    }
  }

  t.deepEqual(Graph(A, [B, C, Q]), expected2, 'ignores out of thread messages')
  /// /////////////////////////////////////////////////////////////////

  // ## message in-thread but "dangling" (doesn't link up to known messages)
  //
  //    A   (first)
  //    |
  //    B     ----?--- J? (a message we don't have)
  //    |              |
  //    C              K

  const K = { key: 'K', thread: { first: 'A', previous: ['J'] } }
  const expected3 = {
    graph: {
      A: { B: 1 },
      B: { C: 1 },
      J: { K: 1 }
    },
    nodes: {
      connected: { A, B, C },
      disconnected: { K, J: null }
    }
  }
  t.deepEqual(Graph(A, [B, C, K]), expected3, 'ignores dangles (in-thread but missing causal backlink)')
  /// /////////////////////////////////////////////////////////////////

  t.end()
})

test('buildGraph: merge', t => {
  //     A   (first)
  //    / \
  //   B   C
  //    \ /
  //     D

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['A'] } }
  const D = { key: 'D', thread: { first: 'A', previous: ['B', 'C'] } }

  const expected = () => ({
    graph: {
      A: { B: 1, C: 1 },
      B: { D: 1 },
      C: { D: 1 }
    },
    nodes: {
      connected: { A, B, C, D },
      disconnected: {}
    }
  })

  t.deepEqual(Graph(A, [D, B, C]), expected(), 'happy')
  t.end()
})

test('buildGraph: hydra', { todo: true }, t => {
  t.end()
})

test('buildGraph: dangle', { todo: true }, t => {
  t.end()
})

test('buildGraph: complex merge', { todo: true }, t => {
  t.end()
})
