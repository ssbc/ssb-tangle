const assert = require('assert').strict
const { Map, ReverseMap } = require('./maps')
const Lookup = require('./lookup')
const pruneMap = require('./prune-map')
const isRoot = require('../lib/is-root')

module.exports = function buildEdgeMap (entryNode, otherNodes, opts = {}) {
  const {
    getThread = _getThread
  } = opts

  assert(isRoot(entryNode, getThread))
  assert(Array.isArray(otherNodes))
  assert(typeof getThread === 'function')

  var map = Map(otherNodes, getThread)
  // build map of each hop which runs forward causally
  var reverseMap = ReverseMap(map)
  // and the inverse

  var lookup = Lookup(map, entryNode, otherNodes)

  return {
    getNode: lookup.getNode,
    getEntryNode: () => entryNode,
    getLinks: (nodeId) => {
      if (!map.hasOwnProperty(nodeId)) return []
      return Object.keys(map[nodeId])
    },
    getReverseLinks: (nodeId) => {
      if (!reverseMap.hasOwnProperty(nodeId)) return []
      return Object.keys(reverseMap[nodeId])
    },

    isBranchNode: (nodeId) => {
      if (!map.hasOwnProperty(nodeId)) return false
      return Object.keys(map[nodeId]).length > 1
    },
    isMergeNode: (nodeId) => {
      if (!reverseMap.hasOwnProperty(nodeId)) return false
      return Object.keys(reverseMap[nodeId]).length > 1
    },
    isHeadNode: (nodeId) => {
      if (!lookup.getNode(nodeId)) return false
      if (!map.hasOwnProperty(nodeId)) return true
      return Object.keys(map[nodeId]).length === 0
    },

    prune: (invalidIds) => {
      map = pruneMap(map, entryNode.key, invalidIds)
      reverseMap = ReverseMap(map)

      // TODO ? pruneLookup
    },

    getRaw: () => {
      return { map, reverseMap }
    }
  }
}

function _getThread (node) {
  return node.thread
}
