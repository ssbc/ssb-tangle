const test = require('tape')
const Graph = require('../lib/build-graph')

test('buildGraph: linear', t => {
  //    A   (first)
  //    |
  //    B
  //    |
  //    C

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['B'] } }

  const expected = () => ({
    graph: {
      A: { B: 1 },
      B: { C: 1 }
    },
    nodes: {
      connected: { A, B, C },
      disconnected: {}
    }
  })

  t.deepEqual(Graph(A, [B, C]), expected(), 'happy')
  t.deepEqual(Graph(A, [C, B]), expected(), 'happy (different order)')

  // A totally detached node
  const Q = { key: 'Q', thread: { first: 'R', previous: ['S'] } }
  const e1 = expected()
  e1.graph.S = { Q: 1 }
  e1.nodes.disconnected.Q = Q
  e1.nodes.disconnected.S = null

  t.deepEqual(Graph(A, [B, C, Q]), e1, 'ignores out of thread messages')

  // In thread but ... dangling (doesn't link up to known messages)
  const K = { key: 'K', thread: { first: 'A', previous: ['S'] } }
  const e2 = expected()
  e2.graph.S = { K: 1 }
  e2.nodes.disconnected.K = K
  e2.nodes.disconnected.S = null
  t.deepEqual(Graph(A, [B, C, K]), e2, 'ignores dangles (in-thread but missing causal backlink)')

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
