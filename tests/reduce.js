const test = require('tape')
const reduce = require('../lib/reduce')

test('reduce', t => {
  //     A   (first)
  //    / \
  //   B   C

  const A = {
    key: 'A',
    thread: { first: null, previous: null },
    ouji: 'hello'
  }
  const B = {
    key: 'B',
    thread: { first: 'A', previous: ['A'] },
    ouji: ' mix'
  }
  const C = {
    key: 'C',
    thread: { first: 'A', previous: ['A'] },
    ouji: ' world'
  }

  const strategies = {
    ouji: { // sringAppend
      concat: (a, b) => a + b,
      identity: '',
      isConflict: (a, b) => a !== b,
      conflictMergeType: 'SET'
    }
  }

  t.deepEqual(
    reduce(A, [B, C], strategies),
    {
      B: { ouji: 'hello mix' },
      C: { ouji: 'hello world' }
    },
    'simple hydra'
  )

  //     A   (first)
  //    / \
  //   B   C
  //    \ /
  //     D

  const D = {
    key: 'D',
    thread: { first: 'A', previous: ['B', 'C'] },
    ouji: 'hello world (mix)'
  }

  t.deepEqual(
    reduce(A, [B, C, D], strategies),
    {
      D: { ouji: 'hello world (mix)' }
    },
    'simple hydra'
  )

  t.end()
})
