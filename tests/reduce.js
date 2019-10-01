const test = require('tape')
const reduce = require('../lib/reduce')

test('reduce', t => {
  //     A   (first)
  //    / \
  //   B   C

  const A = {
    key: 'A',
    ouji: 'hello',
    thread: { first: null, previous: null }
  }
  const B = {
    key: 'B',
    ouji: ' mix',
    thread: { first: 'A', previous: ['A'] }
  }
  const C = {
    key: 'C',
    ouji: ' world',
    thread: { first: 'A', previous: ['A'] }
  }

  const strategies = {
    ouji: { // sringAppend
      concat: (a, b) => a + b,
      identity: '',
      isConflict: (a, b) => a !== b,
      conflictMerge: (merge, heads) => merge
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
    ouji: 'hello world (mix)',
    thread: { first: 'A', previous: ['B', 'C'] }
  }

  t.deepEqual(
    reduce(A, [B, C, D], strategies),
    {
      D: { ouji: 'hello world (mix)' }
    },
    'merge with conflict'
  )

  t.end()
})
