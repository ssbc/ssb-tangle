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

    if (!map.hasOwnProperty(key)) continue

    Object.keys(map[key]).forEach(linkedKey => queue.unshift(linkedKey))
  }

  // insert referenced but unknown nodes into disconnected
  // storing the value as null
  Object.values(disconnected).forEach(node => {
    node.thread.previous.forEach(linkedKey => {
      if (!disconnected.hasOwnProperty[linkedKey]) disconnected[linkedKey] = null
    })
  })

  return {
    connected,
    disconnected,
    getNode: (key) => {
      if (connected.hasOwnProperty(key)) return connected[key]
      else if (disconnected.hasOwnProperty(key)) {
        console.warn(`key ${key} found, but is disconnected from main graph`)
      } else {
        console.warn(`key ${key} not in lookup`)
      }
    }
  }
}
