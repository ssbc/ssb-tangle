const {
  buildLongestPathMap,
  longestPathLength
} = require('./dijkstra')

module.exports = function findTimeTravellers (graph, opts = {}) {
  const {
    getAuthor = (node) => node.author,
    getSeq = (node) => node.seq
  } = opts

  const getLongestPath = GetLongestPath(graph)

  var authorLedger = AuthorLedger()
  var queue = graph.rootNodeKeys
  var nodeId, node, author

  while (queue.length) {
    nodeId = queue.shift()
    node = graph.getNode(nodeId)
    author = getAuthor(node)

    authorLedger.add(author, { nodeId, seq: getSeq(node), dist: getLongestPath(nodeId) })

    graph.getLinks(nodeId).forEach(nodeId => queue.push(nodeId))
  }

  return reviewLedger(authorLedger)
}

function AuthorLedger () {
  var ledger = {}
  // for each author, for each message they posted, collect into an array
  // { nodeId, seq, dist: longest distance to that message }

  return {
    add: (author, record) => {
      if (!(author in ledger)) ledger[author] = []
      ledger[author].push(record)
    },
    forEach: (entry, cb) => Object.entries(ledger).forEach(entry, cb)
  }
}

function GetLongestPath (graph) {
  const { linkMap } = graph.raw
  if (graph.rootNodeKeys.length > 1) throw new Error('code not yet designed for multiple entry nodes')
  const entryId = graph.rootNodeKeys[0]

  const dmap = buildLongestPathMap(linkMap, entryId)

  return function longestPath (exitId) {
    return longestPathLength(linkMap, entryId, exitId, { dmap })
  }
}

function reviewLedger (authorLedger) {
  var timeTravellers = []

  authorLedger.forEach(([author, collection]) => {
    collection
      .sort((a, b) => a.seq - b.seq) // sort for ascending seq
      .forEach((nodeData, i, arr) => {
        if (i === 0) return
        if (nodeData.dist > arr[i - 1].dist) return

        // distance from root did not increase, therefore time-traveller found
        timeTravellers.push(nodeData.nodeId)
      })
  })

  return timeTravellers
}
