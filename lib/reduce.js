const Map = require('./build-edge-map.js')
const Lookup = require('./build-node-lookup.js')


module.exports = function reduce (entryNode, otherNodes, strategies) {
  const map = Map(otherNodes)
  const lookup = Lookup(map, entryNode, otherNodes).connected

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

    const nextTcc = concat(Tacc, lookup[key])

    if (!map.hasOwnProperty(key)) heads[key] = nextTcc
    else {
      Object.keys(map[key]).forEach(nextKey => {
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

