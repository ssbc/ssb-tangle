const { buildLongestPathMap, longestPathLength } = require('./dijkstras.js')

module.exports = function findTimeTravellers (map, lookup, entryKey, opts = {}) {
  const {
    getAuthor = (node) => node.author,
    getSeq = (node) => node.seq
  } = opts

  const getLongestPath = GetLongestPath(map, entryKey)

  var authorLedger = AuthorLedger()
  var queue = [entryKey]
  var key, node, author

  while (queue.length) {
    key = queue.shift()
    node = lookup[key]
    author = getAuthor(node)

    authorLedger.add(author, { key, seq: getSeq(node), d: getLongestPath(key) })

    getSuccessors(key).forEach(key => queue.push(key))
  }

  return reviewLedger(authorLedger)

  function getSuccessors (key) {
    if (!map.hasOwnProperty(key)) return []
    return Object.keys(map[key])
  }
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

function GetLongestPath (map, entryKey) {
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
