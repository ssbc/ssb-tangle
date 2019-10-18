const test = require('tape')
const reduce = require('../../graph-tools/reduce')
const OverwriteStrategy = require('../../strategy/overwrite')
const Strategy = require('../../strategy/compose')

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
// TODO change reduce to take compose(composition)

function titleTransformation (val) {
  return { set: val }
}

test('reduce', t => {
  //     A   (root)
  //    / \
  //   B   C

  const A = {
    key: 'A',
    thread: { root: null, previous: null },
    title: titleTransformation('my root message'),
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
    title: titleTransformation('edited message'),
    ouji: ' world'
  }

  t.deepEqual(
    reduce(A, [B, C], strategy),
    {
      B: {
        title: titleTransformation('my root message'),
        ouji: 'hello mix'
      },
      C: {
        title: titleTransformation('edited message'),
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
    title: titleTransformation('edited and merged!'),
    ouji: 'hello world (mix)'
  }
  // this is a valid merge because it resolves the conflict present between B + C
  // with the title + ouji properties

  t.deepEqual(
    reduce(A, [B, C, D], strategy),
    {
      D: {
        title: titleTransformation('edited and merged!'),
        ouji: 'hello world (mix)'
      }
    },
    'merge with conflict'
  )

  t.end()
})

test('reduce (custom getThread)', t => {
  //   A   (root)
  //   |
  //   B

  const A = {
    key: 'A',
    tangles: {
      conversation: [null, null]
    },
    title: titleTransformation('my root message'),
    ouji: 'hello'
  }
  const B = {
    key: 'B',
    tangles: {
      conversation: ['A', ['A']]
    },
    ouji: ' mix'
  }

  const getThread = node => {
    const [ root, previous ] = node.tangles.conversation

    return { root, previous }
  }

  t.deepEqual(
    reduce(A, [B], strategy, { getThread }),
    {
      B: {
        title: titleTransformation('my root message'),
        ouji: 'hello mix'
      }
    },
    'custome getThread works'
  )

  t.end()
})

test('reduce (custom getTransformation)', t => {
  //   A   (root)
  //   |
  //   B

  const A = {
    key: 'A',
    thread: { root: null, previous: null },
    mutations: {
      title: titleTransformation('my root message'),
      ouji: 'hello'
    }
  }
  const B = {
    key: 'B',
    thread: { root: 'A', previous: ['A'] },
    mutations: {
      ouji: ' mix'
    }
  }

  const getTransformation = node => node.mutations

  t.deepEqual(
    reduce(A, [B], strategy, { getTransformation }),
    {
      B: {
        title: titleTransformation('my root message'),
        ouji: 'hello mix'
      }
    },
    'custom getTransformation works'
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
    title: titleTransformation('my root message'),
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
    title: titleTransformation('edited message'),
    ouji: ' world'
  }
  const Dud = {
    key: 'D',
    thread: { root: 'A', previous: ['B', 'C'] },
    title: titleTransformation('edited and merged!')
    // ouji: identity()
  }
  // this is an invalid merge message because Dud fails to resolve conflict between B + C
  // on the 'ouji' property

  t.deepEqual(
    reduce(A, [B, C, Dud], strategy),
    {
      B: {
        title: titleTransformation('my root message'),
        ouji: 'hello mix'
      },
      C: {
        title: titleTransformation('edited message'),
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
    title: titleTransformation('my root message'),
    ouji: 'hello'
  }
  const B = {
    key: 'B',
    thread: { root: 'A', previous: ['A'] },
    title: titleTransformation('one two'),
    ouji: ' mix'
  }
  const C = {
    key: 'C',
    thread: { root: 'A', previous: ['A'] },
    title: titleTransformation('one'),
    ouji: ' world'
  }
  const D = {
    key: 'D',
    thread: { root: 'A', previous: ['C'] },
    title: titleTransformation('one two')
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
        title: titleTransformation('my root message'),
        ouji: 'hello mix-world!'
      }
    },
    'automerge of identical heads + correct conflict resolution'
  )

  t.end()
})
