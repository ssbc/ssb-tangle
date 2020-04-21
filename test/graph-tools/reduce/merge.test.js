const test = require('tape')
const reduce = require('../../../graph-tools/reduce')
const OverwriteStrategy = require('../../../strategy/overwrite')
const Strategy = require('../../../strategy/compose')

const StringAppendStrategy = () => ({ // stringAppend
  concat: (a, b) => a + b,
  identity: () => '',
  isConflict: (a, b) => a !== b,
  // conflictMerge: (merge, heads) => merge,
  reify: a => a
})

const strategy = Strategy({
  title: OverwriteStrategy(),
  ouji: StringAppendStrategy()
})

test('reduce', t => {
  //     A   (root)
  //    / \
  //   B   C

  const A = {
    key: 'A',
    thread: { root: null, previous: null },
    title: { set: 'my root message' },
    ouji: 'hello'
  }
  const B = {
    key: 'B',
    thread: { root: 'A', previous: ['A'] },
    ouji: ' mix'
  }
  const C = {
    key: 'C',
    thread: { root: 'A', previous: ['A'] },
    title: { set: 'edited message' },
    ouji: ' world'
  }

  t.deepEqual(
    reduce(A, [B, C], strategy),
    {
      B: {
        title: { set: 'my root message' },
        ouji: 'hello mix'
      },
      C: {
        title: { set: 'edited message' },
        ouji: 'hello world'
      }
    },
    'simple hydra'
  )

  //     A   (root)
  //    / \
  //   B   C
  //    \ /
  //     D

  const D = {
    key: 'D',
    thread: { root: 'A', previous: ['B', 'C'] },
    title: { set: 'edited and merged!' },
    ouji: 'hello world (mix)'
  }
  // this is a valid merge because it resolves the conflict present between B + C
  // with the title + ouji properties

  t.deepEqual(
    reduce(A, [B, C, D], strategy),
    {
      D: {
        title: { set: 'edited and merged!' },
        ouji: 'hello world (mix)'
      }
    },
    'merge with conflict'
  )

  t.end()
})

test('reduce (invalid merge)', { todo: true }, t => {
  //     A   (root)
  //    / \
  //   B   C
  //    \ /
  //     Dud  << an invalid merge message

  const A = {
    key: 'A',
    thread: { root: null, previous: null },
    title: { set: 'my root message' },
    ouji: 'hello'
  }
  const B = {
    key: 'B',
    thread: { root: 'A', previous: ['A'] },
    ouji: ' mix'
  }
  const C = {
    key: 'C',
    thread: { root: 'A', previous: ['A'] },
    title: { set: 'edited message' },
    ouji: ' world'
  }
  const Dud = {
    key: 'D',
    thread: { root: 'A', previous: ['B', 'C'] },
    title: { set: 'edited and merged!' }
    // ouji: identity()
  }
  // this is an invalid merge message because Dud fails to resolve conflict between B + C
  // on the 'ouji' property

  t.deepEqual(
    reduce(A, [B, C, Dud], strategy),
    {
      B: {
        title: { set: 'my root message' },
        ouji: 'hello mix'
      },
      C: {
        title: { set: 'edited message' },
        ouji: 'hello world'
      }
    },
    'invalid merge message (merge message is ignored)'
  )

  t.end()
})

test('reduce (automerge)', { todo: true }, t => {
  //     A   (root)
  //    / \
  //   B   C
  //   |   |
  //   |   D
  //    \ /
  //     E

  const A = {
    key: 'A',
    thread: { root: null, previous: null },
    title: { set: 'my root message' },
    ouji: 'hello'
  }
  const B = {
    key: 'B',
    thread: { root: 'A', previous: ['A'] },
    title: { set: 'one two' },
    ouji: ' mix'
  }
  const C = {
    key: 'C',
    thread: { root: 'A', previous: ['A'] },
    title: { set: 'one' },
    ouji: ' world'
  }
  const D = {
    key: 'D',
    thread: { root: 'A', previous: ['C'] },
    title: { set: 'one two' }
  }
  const E = {
    key: 'E',
    thread: { root: 'A', previous: ['B', 'D'] },
    ouji: 'hello mix-world!'
  }
  // this is an valid because:
  // - 'title' transformations pre-merge are identical, so can automerge
  // - 'ouji' transformations are in conflict, but a resolution is declared

  t.deepEqual(
    reduce(A, [B, C, D, E], strategy),
    {
      E: {
        title: { set: 'my root message' },
        ouji: 'hello mix-world!'
      }
    },
    'automerge of identical heads + correct conflict resolution'
  )

  t.end()
})
