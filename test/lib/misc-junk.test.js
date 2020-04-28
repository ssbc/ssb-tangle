const test = require('tape')
const { getHeads } = require('../../lib/misc-junk')

test('getHeads: Small graph with one head', t => {
  //    A   (root)
  //    |
  //    B

  const inputMap = {
    A: { B: 1 }
  }

  const expectedHeads = ['B']

  t.deepEqual(getHeads(inputMap), expectedHeads, 'one head')

  t.end()
})

test('getHeads: Root-only graph', t => {
  //    A   (root)

  const inputMap = {
    A: {}
  }

  const expectedHeads = ['A']

  t.deepEqual(getHeads(inputMap), expectedHeads, 'root-only')

  t.end()
})

test('getHeads: Root and dangle', t => {
  //    A   (root)
  //     
  //          ----?--- J? (a message we don't have)
  //                   |
  //                   K

  const inputMap = {
    A: {},
    J: { K: 1 }
  }

  const expectedHeads = ['K']

  t.deepEqual(getHeads(inputMap), expectedHeads, 'root and dangle')

  t.end()
})

test('getHeads: Graph with dangle', t => {
  //    A   (root)
  //    |
  //    B     ----?--- J? (a message we don't have)
  //                   |
  //                   K

  const inputMap = {
    A: { B: 1 },
    J: { K: 1 }
  }

  const expectedHeads = ['B', 'K']

  t.deepEqual(getHeads(inputMap), expectedHeads, 'graph dangle')

  t.end()
})

test('getHeads: Graph with simple merge', t => {
  //     A   (root)
  //    / \
  //   B   C
  //    \ /
  //     D

  const inputMap = {
    A: { B: 1, C: 1 },
    B: { D: 1 },
    C: { D: 1 }
  }

  const expectedHeads = ['D']

  t.deepEqual(getHeads(inputMap), expectedHeads, 'simple merge')

  t.end()
})

test('getHeads: Graph with branch', t => {
  //     A   (root)
  //     |
  //     B
  //    / \
  //   C   D

  const inputMap = {
    A: { B: 1 },
    B: { C: 1, D: 1 }
  }

  const expectedHeads = ['C', 'D']

  t.deepEqual(getHeads(inputMap), expectedHeads, 'simple branch')

  t.end()
})
