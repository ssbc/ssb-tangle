const clone = require('lodash.clone')
const assert = require('assert').strict

module.exports = function pruneMap (map, entryKey, invalidKeys) {
  assert(typeof entryKey === 'string')
  assert(Array.isArray(invalidKeys))

  var allInvalidKeys = new Set(invalidKeys)

  var queue = [entryKey]
  var key

  while (queue.length) {
    key = queue.pop()
    if (!map.hasOwnProperty(key)) continue

    if (allInvalidKeys.has(key)) {
      forEach(map[key], key => {
        allInvalidKeys.add(key)
        queue.push(key)
      })
    } else {
      forEach(map[key], key => queue.push(key))
    }
  }

  var newMap = clone(map)

  // remove the top level invalid nodes
  allInvalidKeys.forEach(key => delete newMap[key])

  // remove the links to any invalid nodes
  forEach(newMap, key => {
    forEach(newMap[key], subKey => {
      if (allInvalidKeys.has(subKey)) delete newMap[key][subKey]
    })

    // remove a map item if it has no remaining valid links
    if (isEmpty(newMap[key])) delete newMap[key]
  })

  return newMap
}

function forEach (object, cb) {
  Object.keys(object).forEach(key => cb(key))
}

function isEmpty (object) {
  return Object.keys(object).length === 0
}
