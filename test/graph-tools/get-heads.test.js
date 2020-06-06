const test = require('tape')
const getHeads = require('../../graph-tools/get-heads')

test('getHeads', t => {
  const tests = [
    () => {
      const DESCRIPTION = 'small graph with one head'
      //    A   (root)
      //    |
      //    B

      const A = {
        key: 'A',
        tangle: { root: null, previous: null }
      }
      const B = {
        key: 'B',
        tangle: { root: 'A', previous: ['A'] }
      }

      const actual = getHeads(A, [B], { getThread: m => m.tangle })
      const expected = ['B']

      t.deepEqual(actual, expected, DESCRIPTION)
    },

    () => {
      const DESCRIPTION = 'root-only graph'
      //    A   (root)
      //
      const A = {
        key: 'A',
        tangle: { root: null, previous: null }
      }

      const actual = getHeads(A, [], { getThread: m => m.tangle })
      const expected = ['A']

      t.deepEqual(actual, expected, DESCRIPTION)
    },

    () => {
      const DESCRIPTION = 'root and dangle'
      //    A   (root)
      //
      //          ----?--- J? (a message we don't have)
      //                   |
      //                   K
      const A = {
        key: 'A',
        tangle: { root: null, previous: null }
      }
      const J = {
        key: 'J',
        tangle: { root: 'A', previous: ['I'] }
      }
      const K = {
        key: 'K',
        tangle: { root: 'A', previous: ['J'] }
      }

      const expected = ['A']
      const actual = getHeads(A, [J, K], { getThread: m => m.tangle })

      t.deepEqual(actual, expected, DESCRIPTION)
    },

    () => {
      const DESCRIPTION = 'graph dangle'
      //    A   (root)
      //    |
      //    B     ----?--- J? (a message we don't have)
      //                   |
      //                   K
      const A = {
        key: 'A',
        tangle: { root: null, previous: null }
      }
      const B = {
        key: 'B',
        tangle: { root: 'A', previous: ['A'] }
      }
      const J = {
        key: 'J',
        tangle: { root: 'A', previous: ['I'] }
      }
      const K = {
        key: 'K',
        tangle: { root: 'A', previous: ['J'] }
      }

      const expected = ['B']
      const actual = getHeads(A, [B, J, K], { getThread: m => m.tangle })

      t.deepEqual(actual, expected, DESCRIPTION)
    },

    () => {
      const DESCRIPTION = 'simple merge'
      //     A   (root)
      //    / \
      //   B   C
      //    \ /
      //     D

      const A = {
        key: 'A',
        tangle: { root: null, previous: null }
      }
      const B = {
        key: 'B',
        tangle: { root: 'A', previous: ['A'] }
      }
      const C = {
        key: 'C',
        tangle: { root: 'A', previous: ['A'] }
      }
      const D = {
        key: 'D',
        tangle: { root: 'A', previous: ['B', 'C'] }
      }

      const expected = ['D']
      const actual = getHeads(A, [B, C, D], { getThread: m => m.tangle })

      t.deepEqual(actual, expected, DESCRIPTION)
    },

    () => {
      const DESCRIPTION = 'simple branch'
      //     A   (root)
      //     |
      //     B
      //    / \
      //   C   D

      const A = {
        key: 'A',
        tangle: { root: null, previous: null }
      }
      const B = {
        key: 'B',
        tangle: { root: 'A', previous: ['A'] }
      }
      const C = {
        key: 'C',
        tangle: { root: 'A', previous: ['B'] }
      }
      const D = {
        key: 'D',
        tangle: { root: 'A', previous: ['B'] }
      }

      const expected = ['C', 'D']
      const actual = getHeads(A, [B, C, D], { getThread: m => m.tangle })

      t.deepEqual(actual, expected, DESCRIPTION)
    }
  ]

  const toRun = tests.length

  tests
    .slice(0, toRun)
    .forEach(t => t())

  t.end()
})
