const test = require('tape')
const reduce = require('../../../graph-tools/reduce')

const Strategy = require('../../../strategy/compose')
const Overwrite = require('../../../strategy/overwrite')
const Set = require('../../../strategy/simple-set')

const strategy = Strategy({
  title: Overwrite(),
  authors: Set()
})

test('reduce (custom getTransformation)', t => {
  //   A   (root)
  //   |
  //   B

  const A = {
    key: 'A',
    thread: { root: null, previous: null },
    mutations: {
      title: { set: 'my root message' },
      authors: { mix: 1, luandro: 1 }
    }
  }
  const B = {
    key: 'B',
    thread: { root: 'A', previous: ['A'] },
    mutations: {
      title: { set: 'my root message' },
      authors: { mix: -1 }
    }
  }

  const getTransformation = node => node.mutations

  t.deepEqual(
    reduce(A, [B], strategy, { getTransformation }),
    {
      B: {
        title: { set: 'my root message' },
        authors: { luandro: 1 }
      }
    },
    'custom getTransformation works'
  )

  t.end()
})
