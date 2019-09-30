const set = require('lodash.set')

module.exports = function buildReverseEdgeMap (map) {
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
