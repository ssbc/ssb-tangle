const set = require('lodash.set')
const isRoot = require('../lib/is-root')

// map objects which represent forward and backward linking maps of the graph
// e.g.
//
//     A   (root)
//    / \
//   B   C
//    \ /
//     D
//
// map = {
//   A: { B: 1, C: 1 },
//   B: { D: 1 },
//   C: { D: 1 }
// }

module.exports = {
  Map,
  ReverseMap
}

function Map (otherNodes, getThread) {
  var map = {}

  otherNodes
    .filter(node => !isRoot(node, getThread))
    .forEach(node => {
      getThread(node).previous.forEach(backlink => {
        set(map, [backlink, node.key], 1)
      })
    })

  return map
}

function ReverseMap (map) {
  var reverseMap = {}

  forEach(map, ([fromNode, toNodes]) => {
    forEach(toNodes, ([toNode, distance]) => {
      set(reverseMap, [toNode, fromNode], distance)
    })
  })

  return reverseMap
}

function forEach (obj, cb) {
  Object.entries(obj).forEach(cb)
}
