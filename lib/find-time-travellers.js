const { buildLongestPathMap, longestPathLength } = require('./dijkstras.js')

module.exports = function findTimeTravellers (map, lookup, entryKey, opts = {}) {
  const {
    getAuthor = (node) => node.author,
    getSeq = (node) => node.seq
  } = opts

  var authorLedger = {}
  // for each author, for each message they posted, collect into an array
  // { key, seq, d: longest distance to that message }

  var dmap = buildLongestPathMap(map, entryKey)

  // NOTE -assumes lookup doesn't have redundant nodes
  // should perhaps just walk map again..
  Object.entries(lookup).forEach(([exitKey, node]) => {
    var author = getAuthor(node)
    if (!authorLedger.hasOwnProperty(author)) authorLedger[author] = []

    authorLedger[author].push({
      key: exitKey,
      seq: getSeq(node),
      d: longestPathLength(map, entryKey, exitKey, { dmap })
    })
  })

  var timeTravellers = []
  Object.values(authorLedger).forEach(authorCollection => {
    authorCollection
      .sort((a, b) => a.seq - b.seq) // sort for ascending seq
      .forEach((nodeData, i, arr) => {
        if (i === 0) return

        if (nodeData.d <= arr[i - 1].d) { // look for NOT increasing distance
          timeTravellers.push(nodeData.key)
        }
      })
  })

  return timeTravellers
}
