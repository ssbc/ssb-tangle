// makes two dictionaries, one for connected nodes, one for disconnected
// each dictionary maps nodeId -> node (where nodeId is unique idenentifier for node)

// e.g.
//
//    A   (root)
//    |
//    B           J? (K points backto this but we don't have it)
//    |           |
//    C           K
//
// lookup = {
//   connected: { A, B, C },
//   disconnected: { J: null, K }
// }

module.exports = function Lookup (map, entryNode, otherNodes) {
  var connected = {}
  var disconnected = {}

  otherNodes.forEach(node => {
    disconnected[node.key] = node
  })

  var queue = [entryNode.key]
  var key
  while (queue.length) {
    key = queue.pop()

    if (connected[key]) continue

    // move record from 'disconnected' dict to 'connected' dict
    if (key === entryNode.key) connected[key] = entryNode
    else {
      connected[key] = disconnected[key]
      delete disconnected[key]
    }

    if (!(key in map)) continue

    Object.keys(map[key]).forEach(linkedKey => queue.unshift(linkedKey))
  }

  // insert referenced but unknown nodes into disconnected
  // storing the value as null
  Object.values(disconnected).forEach(node => {
    node.thread.previous.forEach(linkedKey => {
      if (!(linkedKey in disconnected)) disconnected[linkedKey] = null
    })
  })

  return {
    connected,
    disconnected,
    getNode: (key) => {
      if (key in connected) return connected[key]
      else if (key in disconnected) {
        console.warn(`key ${key} found, but is disconnected from main graph`)
      } else {
        console.warn(`key ${key} not in lookup`)
      }
    }
  }
}
