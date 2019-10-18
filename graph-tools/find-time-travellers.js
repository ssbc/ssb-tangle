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
  var queue = [graph.getEntryNode().key]
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
      if (!ledger.hasOwnProperty(author)) ledger[author] = []
      ledger[author].push(record)
    },
    forEach: (entry, cb) => Object.entries(ledger).forEach(entry, cb)
  }
}

function GetLongestPath (graph) {
  const { map } = graph.getRaw()
  const entryId = graph.getEntryNode().key

  const dmap = buildLongestPathMap(map, entryId)

  return function longestPath (exitId) {
    return longestPathLength(map, entryId, exitId, { dmap })
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
