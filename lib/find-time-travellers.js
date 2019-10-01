const {
  buildLongestPathMap,
  longestPathLength
} = require('./dijkstra.js')

module.exports = function findTimeTravellers (graph, opts = {}) {
  const {
    getAuthor = (node) => node.author,
    getSeq = (node) => node.seq
  } = opts

  const getLongestPath = GetLongestPath(graph)

  var authorLedger = AuthorLedger()
  var queue = [graph.getEntryNode().key]
  var key, node, author

  while (queue.length) {
    key = queue.shift()
    node = graph.getNode(key)
    author = getAuthor(node)

    authorLedger.add(author, { key, seq: getSeq(node), d: getLongestPath(key) })

    graph.getLinks(key).forEach(key => queue.push(key))
  }

  return reviewLedger(authorLedger)
}

function AuthorLedger () {
  var ledger = {}
  // for each author, for each message they posted, collect into an array
  // { key, seq, d: longest distance to that message }

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
  const entryKey = graph.getEntryNode().key

  const dmap = buildLongestPathMap(map, entryKey)

  return function longestPath (exitKey) {
    return longestPathLength(map, entryKey, exitKey, { dmap })
  }
}

function reviewLedger (authorLedger) {
  var timeTravellers = []

  authorLedger.forEach(([author, collection]) => {
    collection
      .sort((a, b) => a.seq - b.seq) // sort for ascending seq
      .forEach((nodeData, i, arr) => {
        if (i === 0) return
        if (nodeData.d > arr[i - 1].d) return

        // distance from root did not increase, therefore time-traveller found
        timeTravellers.push(nodeData.key)
      })
  })

  return timeTravellers
}
