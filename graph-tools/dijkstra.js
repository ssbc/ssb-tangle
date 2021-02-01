// NOTES
// - this is a mutation of dijkstras algorithm to find a **longest** path between two nodes
// - search for "FOR_LONGEST_PATH" to find lines which make this find longest path

module.exports = {
  longestPath,
  longestPathLength,
  buildLongestPathMap
}

function longestPath (edgeMap, entryNode, exitNode, opts = {}) {
  const map = opts.dmap || buildLongestPathMap(edgeMap, entryNode)

  if (!map[exitNode]) {
    console.error('unreachable exit-node')
    return null
  }

  const path = []
  let currentNode = exitNode
  while (currentNode) {
    path.unshift(currentNode)

    currentNode = map[currentNode]
      ? map[currentNode].previous // key or null (if at entryNode)
      : false
  }

  return path
}

function longestPathLength (edgeMap, entryNode, exitNode, opts = {}) {
  const map = opts.dmap || buildLongestPathMap(edgeMap, entryNode)

  if (!map[exitNode]) {
    console.error('unreachable exit-node')
    return null
  }

  return map[exitNode].cost
}

function buildLongestPathMap (edgeMap, entryNode) {
  const pathsMap = {
    [entryNode]: { previous: null, cost: 0 }
  }
  // node => { previous, cost }

  const queue = [{ node: entryNode, cost: 0 }]
  let currentRecord

  while (queue.length) {
    currentRecord = queue.pop()
    if (!edgeMap[currentRecord.node]) continue

    Object.entries(edgeMap[currentRecord.node])
      .forEach(([node, cost]) => {
        //
        // currentNode -----cost-----> node

        // if already have a record for how to get to this new node,
        // and that record has a better cost (i.e. higher path cost that current proposal)
        // then don't consider this an update, and don't queue up stepping to that node
        if (
          // already exists
          pathsMap[node] &&
          // don't have more expensive path
          (pathsMap[node].cost > currentRecord.cost + cost) // FOR_LONGEST_PATH
        ) return

        // store or update an entry in the paths map
        pathsMap[node] = {
          previous: currentRecord.node,
          cost: currentRecord.cost + cost
        }

        // queue up stepping to this node and explore territory from there
        queue.unshift({ node, cost: currentRecord.cost + cost })
      })

    // sort lowest to highest cost, so next currentNode is highest-cost
    queue.sort((a, b) => a.cost - b.cost) // FOR_LONGEST_PATH
  }

  return pathsMap
}
