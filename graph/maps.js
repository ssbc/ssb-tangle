const set = require('lodash.set')
const isFirst = require('../lib/is-first')

// map objects which represent forward and backward linking maps of the graph

module.exports = {
  Map,
  ReverseMap
}

function Map (otherNodes, getThread = _getThread) {
  var map = {}

  otherNodes
    .filter(node => !isFirst(node, getThread))
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

function _getThread (node) {
  return node.thread
}
