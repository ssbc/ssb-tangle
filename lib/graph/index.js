const assert = require('assert').strict
const { Map, ReverseMap } = require('./maps')
const Lookup = require('./lookup')
const isFirst = require('../is-first')

module.exports = function buildEdgeMap (entryNode, otherNodes, getThread = _getThread) {
  assert(isFirst(entryNode, getThread))
  assert(Array.isArray(otherNodes))
  assert(typeof getThread === 'function')

  // build map of each hop which runs forward causally
  var map = Map(otherNodes, getThread)
  var reverseMap = ReverseMap(map)
  // and the inverse

  var lookup = Lookup(map, entryNode, otherNodes)

  return {
    getLinks: (key) => {
      if (!map.hasOwnProperty(key)) return []

      return Object.keys(map[key])
    },
    getEntryNode: () => entryNode,
    getNode: lookup.getNode,
    isMergeNode: (key) => {
      if (!reverseMap.hasOwnProperty(key)) return false

      return Object.keys(reverseMap[key]).length > 1
    },
    // prune
    getRaw: () => {
      return { map, reverseMap }
    }
  }
}

function _getThread (node) {
  return node.thread
}
