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

// NOTES
//      A  (first)
//      |
//      B-----E (wario+21)   (E is naughty time-travel)
//      |
//      C
//      |
//      D (wario+20)

//         A  (first)
//        / \
//       B   C
//      /   / \
//     |   D   E
//      \   \ /
//       \   F
//        \ / \
//         G   H
//         |
//         I
//
// paths:
// A-B-G-I
// A-C-D-F-G-I
// A-C-D-F-H
// A-C-E-F-G-I
//
// branch nodes: A, C, F
// merge nodes: F, G
// head nodes: H, I
//
// you aren't allowed to create a branch anywhere above you on the graph
//
// if you're on one branch you can't also be on a parallel one

// Algorithm ideas
// - check paths below "branch" nodes (remember a branch could go >= 2 ways)
//   - for each pair of paths, until a head or common merge is reached, look for duplicitous participation
//
// - start at a branch
//   - walk one path till reach a merge or end, then pause
//   - walk another till reach a merge, check if it's the same

//         A  (first)
//        / \
//       B   C
//          / \
//         D   E
//          \ /
//           F
//
// paths:
// A-B
// A-C-D-F
// A-C-E-F

// NOTE: Invalid merge to test for
//
//         A  (first)
//        /
//       B---C
//       |  / \
//       | D   E
//       |  \ /
//       \   F
//        \ /
//         G
