const set = require('lodash.set')
const assert = require('assert').strict
const isFirst = require('./is-first')

module.exports = function buildEdgeMap (otherNodes, getThread = _getThread) {
  assert(Array.isArray(otherNodes))
  assert(typeof getThread === 'function')

  // build map of each hop which runs forward causally
  var map = {}
  const results = otherNodes
    .filter(node => {
      // console.log(node, isFirst(node, getThread))
      return !isFirst(node, getThread)
    })

  results
    .forEach(node => {
      getThread(node).previous.forEach(backlink => {
        set(map, [backlink, node.key], 1)
      })
    })

  return map
}

function _getThread (node) {
  return node.thread
}
