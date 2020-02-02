const test = require('tape')
const reduce = require('../../../graph-tools/reduce')

const Strategy = require('../../../strategy/compose')
const Overwrite = require('../../../strategy/overwrite')

const strategy = Strategy({
  title: Overwrite()
})

test('reduce (custom isValid)', t => {
  //   A   (root)
  //   |
  //   B

  const A = {
    key: 'A',
    author: '@mix',
    thread: { root: null, previous: null },
    title: { set: 'my root message' }
  }
  const B = {
    key: 'B',
    author: '@stranger',
    thread: { root: 'A', previous: ['A'] },
    title: { set: 'nice nice' }
  }

  function isValid (state, nextNode) {
    const { accT, entryNode, graph } = state

    return nextNode.author === entryNode.author
  }

  const expected = {
    A: {
      title: { set: 'my root message' }
    }
  }

  t.deepEqual(
    reduce(A, [B], strategy, { isValid }),
    expected,
    'follows isValid rules'
  )
  t.end()
})


// questions:
// - should it just perform an additional check before / after basic tangle validity checks have been made?
// - is this where "is time-traveller" check would be made?
//     - if so might need "nodes so far" / "path" + lookup
//     - mind you reverseMap should get us nodes so far if needed, so perhaps only the lookup + reverseMap
//     - or the graph object
