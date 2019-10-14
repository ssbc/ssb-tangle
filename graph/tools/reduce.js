const Graph = require('../')
const Queue = require('../../lib/queue')
const Concat = require('../../strategies/tools/concat')

module.exports = function reduce (entryNode, otherNodes, strategies) {
  const graph = Graph(entryNode, otherNodes)

  // TODO prune time-travllers
  // TODO write strategies validation

  const initialT = getInitialTransformation(strategies)
  const concat = Concat(strategies)

  var queue = new Queue()
  // a queue made up of elements { nodeId, accT }
  //   nodeId = the unique identifier for a node
  //   accT = the accumulated (concat'd) Transformation up to and including the Transformation
  //          described in node 'nodeId'

  var heads = {
    preMerge: new Map(),
    // a Map of form { [nodeId]: accT }
    // which describes the nodes immediately preceeding a merge-node
    terminal: {}
  }

  queue.add({
    nodeId: entryNode.key,
    accT: concat(initialT, graph.getNode(entryNode.key))
  })

  while (!queue.isEmpty()) {
    var { nodeId, accT } = queue.next()
    // accT is the accumulated Transformation so far
    // (NOT including Transformation stored in key though, that's what we're )

    if (graph.isHeadNode(nodeId)) {
      heads.terminal[nodeId] = accT
      continue
    }

    graph.getLinks(nodeId).forEach(nextId => {
      if (!graph.isMergeNode(nextId)) {
        queue.add({
          nodeId: nextId,
          accT: concat(accT, graph.getNode(nextId))
        })
        // queue up the another node to explore from
      } else {
        heads.preMerge.set(nodeId, accT)

        const requiredKeys = graph.getReverseLinks(nextId)
        const ready = requiredKeys.every(nodeId => heads.preMerge.has(nodeId))
        // check heads.preMerge store to see if we now have the state needed to complete merge

        if (ready) {
          const preMergeTransformations = requiredKeys.map(nodeId => heads.preMerge.get(nodeId))
          const mergeTransformation = graph.getNode(nextId)

          // <----- WIP-start----->

          // ALGORITHM:
          // is there a conflict between heads (preMergeTransformations) ?
          // - yes: do merge of heads, then concat result with mergeTransformation
          // - no: does mergeTransformation resolves heads conflict?
          //    - yes: do it (may need to fi
          //    - no: throw out the merge....


          // HACKY + fails some cases
          var nextT = {}
          Object.keys(strategies).forEach(prop => {
            nextT[prop] = mergeTransformation[prop]
          })

          queue.add({
            nodeId: nextId,
            accT: nextT
          })
          // this is a set (over-rides all transformations so far)
          // and for all properties, which is wrong because it ignores invalid merges, and over-writes values not named in the merge with identity?

          // <----- WIP-end----->
        }
      }
    })
  }

  return heads.terminal
}

function getInitialTransformation (strategies) {
  var state = {}

  Object.entries(strategies).forEach(([prop, strategy]) => {
    state[prop] = strategy.identity
  })

  return state
}
