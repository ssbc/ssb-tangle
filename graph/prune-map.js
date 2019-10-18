const clone = require('lodash.clone')
const assert = require('assert').strict

module.exports = function pruneMap (map, entryId, invalidIds) {
  assert(typeof entryId === 'string')
  assert(Array.isArray(invalidIds))

  var allInvalidIds = new Set(invalidIds)

  var queue = [entryId]
  var nodeId

  while (queue.length) {
    nodeId = queue.pop()
    if (!map.hasOwnProperty(nodeId)) continue

    if (allInvalidIds.has(nodeId)) {
      forEachKey(map[nodeId], nodeId => {
        allInvalidIds.add(nodeId)
        queue.push(nodeId)
      })
    } else {
      forEachKey(map[nodeId], nodeId => queue.push(nodeId))
    }
  }

  var newMap = clone(map)

  // remove the top level invalid nodes
  allInvalidIds.forEach(nodeId => delete newMap[nodeId])

  // remove the links to any invalid nodes
  forEachKey(newMap, fromNodeId => {
    forEachKey(newMap[fromNodeId], toNodeId => {
      if (allInvalidIds.has(toNodeId)) delete newMap[fromNodeId][toNodeId]
    })

    // remove a map item if it has no remaining valid links
    if (isEmpty(newMap[fromNodeId])) delete newMap[fromNodeId]
  })

  return newMap
}

function forEachKey (object, cb) {
  Object.keys(object).forEach(key => cb(key))
}

function isEmpty (object) {
  return Object.keys(object).length === 0
}
