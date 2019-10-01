const set = require('lodash.set')
const assert = require('assert').strict
const isFirst = require('./is-first')

module.exports = function buildEdgeMap (entryNode, otherNodes, getThread = _getThread) {
  assert(isFirst(entryNode))
  assert(Array.isArray(otherNodes))
  assert(typeof getThread === 'function')

  // build map of each hop which runs forward causally
  var map = Map(otherNodes, getThread)
  // and the inverse
  var reverseMap = ReverseMap(map)

  return {
    getLinks: (key) => {
      if (!map.hasOwnProperty(key)) return []

      return Object.keys(map[key])
    },
    // prune
    getRaw: () => {
      return { map, reverseMap }
    }
  }
}

function forEach (obj, cb) {
  Object.entries(obj).forEach(cb)
}

function _getThread (node) {
  return node.thread
}
