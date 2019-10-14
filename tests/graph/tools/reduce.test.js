const test = require('tape')
const reduce = require('../../../graph/tools/reduce')
const OverwriteStrategy = require('../../../strategies/overwrite')

const StringAppendStrategy = () => ({ // sringAppend
  concat: (a, b) => a + b,
  identity: '',
  isConflict: (a, b) => a !== b,
  conflictMerge: (merge, heads) => merge
})

const strategies = {
  title: OverwriteStrategy(),
  ouji: StringAppendStrategy()
}

test('reduce', t => {
  //     A   (first)
  //    / \
  //   B   C

  const A = {
    key: 'A',
    thread: { first: null, previous: null },
    title: strategies.title.Transformation('my first message'),
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
    title: strategies.title.Transformation('edited message'),
    ouji: ' world'
  }

  t.deepEqual(
    reduce(A, [B, C], strategies),
    {
      B: {
        title: strategies.title.Transformation('my first message'),
        ouji: 'hello mix'
      },
      C: {
        title: strategies.title.Transformation('edited message'),
        ouji: 'hello world'
      }
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
    title: strategies.title.Transformation('edited and merged!'),
    ouji: 'hello world (mix)'
  }
  // this is a valid merge because it resolves the conflict present between B + C
  // with the title + ouji properties

  t.deepEqual(
    reduce(A, [B, C, D], strategies),
    {
      D: {
        title: strategies.title.Transformation('edited and merged!'),
        ouji: 'hello world (mix)'
      }
    },
    'merge with conflict'
  )

  t.end()
})

test('reduce (invalid merge)', t => {
  //     A   (first)
  //    / \
  //   B   C
  //    \ /
  //     Dud  << an invalid merge message

  const A = {
    key: 'A',
    thread: { first: null, previous: null },
    title: strategies.title.Transformation('my first message'),
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
    title: strategies.title.Transformation('edited message'),
    ouji: ' world'
  }
  const Dud = {
    key: 'D',
    thread: { first: 'A', previous: ['B', 'C'] },
    title: strategies.title.Transformation('edited and merged!'),
    ouji: strategies.ouji.identity
  }
  // this is an invalid merge message because Dud fails to resolve conflict between B + C
  // on the 'ouji' property

  t.deepEqual(
    reduce(A, [B, C, Dud], strategies),
    {
      B: {
        title: strategies.title.Transformation('my first message'),
        ouji: 'hello mix'
      },
      C: {
        title: strategies.title.Transformation('edited message'),
        ouji: 'hello world'
      }
    },
    'invalid merge message (merge message is ignored)'
  )

  t.end()
})

test('reduce (automerge)', t => {
  //     A   (first)
  //    / \
  //   B   C
  //   |   |
  //   |   D
  //    \ /
  //     E

  const A = {
    key: 'A',
    thread: { first: null, previous: null },
    title: strategies.title.Transformation('my first message'),
    ouji: 'hello'
  }
  const B = {
    key: 'B',
    thread: { first: 'A', previous: ['A'] },
    title: strategies.title.Transformation('one two'),
    ouji: ' mix'
  }
  const C = {
    key: 'C',
    thread: { first: 'A', previous: ['A'] },
    title: strategies.title.Transformation('one'),
    ouji: ' world'
  }
  const D = {
    key: 'D',
    thread: { first: 'A', previous: ['C'] },
    title: strategies.title.Transformation('one two')
  }
  const E = {
    key: 'E',
    thread: { first: 'A', previous: ['B', 'D'] },
    ouji: 'hello mix-world!'
  }
  // this is an valid because:
  // - 'title' transformations pre-merge are identical, so can automerge
  // - 'ouji' transformations are in conflict, but a resolution is declared

  t.deepEqual(
    reduce(A, [B, C, D, E], strategies),
    {
      E: {
        title: strategies.title.Transformation('my first message'),
        ouji: 'hello mix-world!'
      }
    },
    'invalid merge message (merge message is ignored)'
  )

  t.end()
})
