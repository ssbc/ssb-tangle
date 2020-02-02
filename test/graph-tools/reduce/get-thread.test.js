const test = require('tape')
const reduce = require('../../../graph-tools/reduce')

const Strategy = require('../../../strategy/compose')
const Overwrite = require('../../../strategy/overwrite')

const strategy = Strategy({
  title: Overwrite()
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
    title: { set: 'my root message' }
  }
  const B = {
    key: 'B',
    tangles: {
      conversation: ['A', ['A']]
    },
    title: { set: 'nice nice' }
  }

  const getThread = node => {
    const [root, previous] = node.tangles.conversation

    return { root, previous }
  }

  t.deepEqual(
    reduce(A, [B], strategy, { getThread }),
    {
      B: {
        title: { set: 'nice nice' }
      }
    },
    'custome getThread works'
  )

  t.end()
})
