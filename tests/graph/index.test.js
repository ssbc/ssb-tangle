const test = require('tape')
const Graph = require('../../graph')

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

  t.equal(graph.isBranchNode('A'), true)
  t.equal(graph.isBranchNode('B'), false)
  t.equal(graph.isBranchNode('D'), false)
  t.equal(graph.isBranchNode('Y'), false)

  t.equal(graph.isMergeNode('A'), false)
  t.equal(graph.isMergeNode('B'), false)
  t.equal(graph.isMergeNode('D'), true)
  t.equal(graph.isMergeNode('Y'), false)

  t.equal(graph.isHeadNode('A'), false)
  t.equal(graph.isHeadNode('B'), false)
  t.equal(graph.isHeadNode('D'), true)
  t.equal(graph.isHeadNode('Y'), false)

  t.end()
})
