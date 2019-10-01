const Graph = require('./graph')

module.exports = function reduce (entryNode, otherNodes, strategies) {
  const graph = Graph(entryNode, otherNodes)

  // TODO prune time-travllers

  const initialT = getInitialTransformation(strategies)
  const concat = Concat(strategies)

  var queue = new Queue()
  var toMerge = {} // <<<<< WIP here
  var heads = {}
  // var processed = {}

  queue.add({ key: entryNode.key, Tacc: initialT })

  while (!queue.isEmpty()) {
    const { key, Tacc } = queue.next()

    const nextTcc = concat(Tacc, graph.getNode(key))

    if (!graph.getLinks(key).length) heads[key] = nextTcc
    else {
      graph.getLinks(key).forEach(nextKey => {
        // check if nextKey we're linking to is a merge
        // if we are, then check the toMerge store to see if we now have the
        // pieces needed to complete merge
        //   if we don't, store current key and nextTcc in toMerge
        //   if we do, check if merge is valid an do it!
        if (graph.isMergeNode(key)) {
          // <<<<<< WIP here
        }

        // if it wasn't a merge pass queue up the next step
        // (key plus, accumulated T state we've built so far)
        queue.add({ key: nextKey, Tacc: nextTcc })
      })
    }
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

