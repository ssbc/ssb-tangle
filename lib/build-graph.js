const set = require('lodash.set')
const assert = require('assert').strict

module.exports = function buildGraph (nodes) {
  assert(Array.isArray(nodes))

  const { firstNode, otherNodes } = splitOnFirst(nodes)
  const { graph, connectedNodes } = walk(firstNode, otherNodes)

  return {
    graph,
    first: firstNode.key,
    nodes: {
      connected: connectedNodes
      // disconectedNodes??
    }
  }
}

function splitOnFirst (nodes) {
  const { firstNodes, otherNodes } = nodes.reduce(
    (acc, node) => {
      if (isFirst(node)) acc.firstNodes.push(node)
      else acc.otherNodes.push(node)

      return acc
    },
    { firstNodes: [], otherNodes: [] }
  )
  assert(firstNodes.length === 1)

  return {
    firstNode: firstNodes[0],
    otherNodes
  }
}

function isFirst (node) {
  assert(node.thread)

  return node.thread.first === null &&
    node.thread.previous === null
}

function walk (start, nodes, initial = {}) {
  // head is the current node we're working onwards (causally) from

  var { graph = {}, connectedNodes = {} } = initial

  connectedNodes[start.key] = start

  nodes.forEach(node => {
    if (node.thread.previous.includes(start.key)) {
      set(graph, [start.key, node.key], 1)
      walk(node, nodes, { graph, connectedNodes })
    }
  })

  return { graph, connectedNodes }
}
