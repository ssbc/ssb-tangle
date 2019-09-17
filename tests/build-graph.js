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

  const expected = {
    nodes: {
      connected: { A, B, C }
    },
    first: 'A',
    graph: {
      A: { B: 1 },
      B: { C: 1 }
    }
  }

  t.deepEqual(Graph([A, B, C]), expected, 'happy')
  t.deepEqual(Graph([B, A, C]), expected, 'happy (different order)')

  // A totally detached node
  const Q = { key: 'Q', thread: { first: 'R', previous: ['S'] } }
  t.deepEqual(Graph([A, B, C, Q]), expected, 'ignores out of thread messages')

  // In thread but ... dangling (doesn't link up to known messages)
  const K = { key: 'Q', thread: { first: 'A', previous: ['S'] } }
  t.deepEqual(Graph([A, B, C, K]), expected, 'ignores dangles (in-thread but missing causal backlink)')

  t.end()
})

test('buildGraph: merge', t => {
  //    A   (first)
  //   / \
  //  B   C
  //   \ /
  //    D

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['A'] } }
  const D = { key: 'D', thread: { first: 'A', previous: ['B', 'C'] } }

  const expected = {
    nodes: {
      connected: { A, B, C, D }
    },
    first: 'A',
    graph: {
      A: { B: 1, C: 1 },
      B: { D: 1 },
      C: { D: 1 }
    }
  }

  t.deepEqual(Graph([D, B, C, A]), expected, 'happy')
  t.end()
})

test('buildGraph: hydra', { todo: true }, t => {
  t.end()
})

test('buildGraph: complex merge', { todo: true }, t => {
  t.end()
})
