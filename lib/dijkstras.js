function longestPath (edgeMap, entryNode, exitNode, opts = {}) {
  const map = opts.dmap || buildLongestPathMap(edgeMap, entryNode)

  if (!map[exitNode]) {
    console.error('unreachable exit-node')
    return null
  }

  var path = []
  var currentNode = exitNode
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
  var pathsMap = {
    [entryNode]: { previous: null, cost: 0 }
  }
  // node => { previous, cost }

  var queue = [{ node: entryNode, cost: 0 }]
  var currentRecord

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
          pathsMap[node] && // already exists
          (pathsMap[node].cost > currentRecord.cost + cost) // don't have more expensive path
        ) return

        // store or update an entry in the paths map
        pathsMap[node] = {
          previous: currentRecord.node,
          cost: currentRecord.cost + cost
        }

        // queue up stepping to make this node the currentNode and explore territory from there
        queue.push({ node, cost: currentRecord.cost + cost })
      })

    queue.sort((a, b) => a.cost - b.cost)
    // sort lowest to highest cost, so next currentNode is highest-cost
  }

  return pathsMap
}

// NOTE - to convert this to dijkstras shortest, flip code on lines 47, 60

module.exports = {
  longestPath,
  longestPathLength,
  buildLongestPathMap
}
