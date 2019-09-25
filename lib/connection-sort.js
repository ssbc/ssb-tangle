module.exports = function connectionSort (map, first, otherNodes) {
  var connected = {}
  var disconnected = {}

  otherNodes.forEach(node => {
    disconnected[node.key] = node
  })

  var queue = [first.key]
  var key
  while (queue.length) {
    key = queue.pop()

    if (connected[key]) continue

    // move record from 'disconnected' dict to 'connected' dict
    if (key === first.key) connected[key] = first
    else {
      connected[key] = disconnected[key]
      delete disconnected[key]
    }

    if (!map.hasOwnProperty(key)) continue

    Object.keys(map[key]).forEach(linkedKey => queue.push(linkedKey))
  }

  // insert referenced but unknown nodes into disconnected
  // storing the value as null
  Object.values(disconnected).forEach(node => {
    node.thread.previous.forEach(linkedKey => {
      if (!disconnected.hasOwnProperty[linkedKey]) disconnected[linkedKey] = null
    })
  })

  return { connected, disconnected }
}
