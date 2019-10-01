const test = require('tape')
const Graph = require('../../lib/graph')

test('Graph', t => {
  //     A   (first)
  //    / \
  //   B   C
  //    \ /
  //     D

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['A'] } }
  const D = { key: 'D', thread: { first: 'A', previous: ['B', 'C'] } }

  const graph = Graph(A, [B, C, D])

  t.false(graph.isMergeNode('A'))
  t.false(graph.isMergeNode('B'))
  t.true(graph.isMergeNode('D'))
  t.false(graph.isMergeNode('Y'))

  t.end()
})
