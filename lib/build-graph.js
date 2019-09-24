const set = require('lodash.set')
const assert = require('assert').strict

module.exports = function buildGraph (first, otherNodes) {
  assert(isFirst(first))
  assert(Array.isArray(otherNodes))

  // build map of each hop which runs forward causally
  var graph = {}
  var disconnected = {}
  otherNodes.forEach(node => {
    node.thread.previous.forEach(backlink => {
      set(graph, [backlink, node.key], 1)
    })

    disconnected[node.key] = node // collecting for next step
  })

  // sort out connected nodes by walking the graph
  var connected = {}
  var queue = [first.key]
  var key
  while (queue.length) {
    key = queue.pop()

    if (connected[key]) continue

    // move record from 'disconnected' map to 'connected' map
    if (key === first.key) connected[key] = first
    else {
      connected[key] = disconnected[key]
      delete disconnected[key]
    }

    if (!graph.hasOwnProperty(key)) continue

    Object.keys(graph[key]).forEach(linkedKey => queue.push(linkedKey))
  }

  // insert referenced but unknown nodes into disconnected under their key, with value null
  Object.values(disconnected).forEach(node => {
    node.thread.previous.forEach(linkedKey => {
      if (!disconnected.hasOwnProperty[linkedKey]) disconnected[linkedKey] = null
    })
  })

  return {
    graph,
    nodes: {
      connected,
      disconnected
    }
  }
}

function isFirst (node) {
  assert(node.key)
  assert(node.thread)

  return node.thread.first === null &&
    node.thread.previous === null
}
