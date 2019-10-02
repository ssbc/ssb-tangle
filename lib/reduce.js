const Graph = require('./graph')

module.exports = function reduce (entryNode, otherNodes, strategies) {
  const graph = Graph(entryNode, otherNodes)

  // TODO prune time-travllers

  const initialT = getInitialTransformation(strategies)
  const concat = Concat(strategies)

  var queue = new Queue()
  // a queue of value pairs: key, and the accumulated transformations
  // up to and including the transformations stored in that key

  var toMerge = {}
  // a collection of keys (acculumulated transformations) for nodes
  // immediately preceeding a merge-node

  var heads = {}
  // var processed = {}

  queue.add({
    key: entryNode.key,
    T: concat(initialT, graph.getNode(entryNode.key))
  })

  while (!queue.isEmpty()) {
    const { key, T } = queue.next()
    // T is the accumulated Transformation so far
    // (NOT including Transformation stored in key though, that's what we're )

    if (graph.isHeadNode(key)) {
      heads[key] = T
      continue
    }

    graph.getLinks(key).forEach(nextKey => {
      if (!graph.isMergeNode(nextKey)) {
        // queue up the next step
        const nextT = concat(T, graph.getNode(nextKey))
        queue.add({ key: nextKey, T: nextT })
      } else {
        toMerge[key] = T

        // check the toMerge store to see if we now have the
        // pieces needed to complete merge
        const requiredKeys = graph.getReverseLinks(nextKey)

        const ready = requiredKeys.every(key => {
          return toMerge.hasOwnProperty(key)
        })

        if (ready) {
          var transformations = []
          requiredKeys.forEach(key => {
            if (!toMerge.hasOwnProperty(key)) return
            transformations.push(toMerge[key])
          })

          // check if merge is valid an do it!
          //
          // check if conflict
          // - yes: then do a set ...
          // - no: auto-merge, and concat

          // this should be per-property in strategy

          const T = graph.getNode(nextKey)
          var nextT = {}
          Object.keys(strategies).forEach(prop => {
            if (T.hasOwnProperty(prop)) {
              nextT[prop] = T[prop]
            }
          })

          queue.add({ key: nextKey, T: nextT })
          // this is a set (over-rides all transformations so far)
          // and for all properties, which seems wrong

          console.log(transformations)
        }
      }
    })

    // processed[key] = true
  }

  return heads
}

function Concat (strategies) {
  return function (a, b) {
    var c = {}

    Object.entries(strategies).forEach(([prop, strategy]) => {
      c[prop] = strategy.concat(
        a[prop] || strategy.identity,
        b[prop] || strategy.identity
      )
    })

    return c
  }
}

function getInitialTransformation (strategies) {
  var state = {}

  Object.entries(strategies).forEach(([prop, strategy]) => {
    state[prop] = strategy.identity
  })

  return state
}

function Queue (initial = []) {
  this.q = Array.from(initial)
}
Queue.prototype.add = function (el) { this.q.push(el) }
Queue.prototype.next = function () { return this.q.shift() }
Queue.prototype.isEmpty = function () { return this.q.length === 0 }

