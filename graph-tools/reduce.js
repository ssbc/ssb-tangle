const Graph = require('@tangle/graph')
const Queue = require('../lib/queue')

module.exports = function reduce (entryNode, otherNodes, strategy, opts = {}) {
  const {
    getThread,
    getTransformation = i => i
  } = opts

  const getBacklinks = getThread
    ? node => getThread(node).previous 
    : node => node.thread.previous 
  const graph = new Graph([entryNode, ...otherNodes], { getBacklinks })

  // TODO prune time-travllers

  const { concat, pureTransformation } = strategy
  const getT = (nodeId) => {
    return pureTransformation(
      getTransformation(graph.getNode(nodeId))
    )
  }

  var queue = new Queue()
  // a queue made up of elements { nodeId, accT }
  //   nodeId = the unique identifier for a node
  //   accT = the accumulated (concat'd) Transformation up to and including the Transformation
  //          described in node 'nodeId'
  queue.add({
    nodeId: entryNode.key,
    accT: getT(entryNode.key)
  })

  var heads = {
    preMerge: new Map(),
    // a Map of form { [nodeId]: accT }
    // which describes the nodes immediately preceeding a merge-node
    terminal: {}
  }

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
          accT: concat(accT, getT(nextId))
        })
        // queue up the another node to explore from
      } else {
        heads.preMerge.set(nodeId, accT)

        const requiredKeys = graph.getBacklinks(nextId)
        const ready = requiredKeys.every(nodeId => heads.preMerge.has(nodeId))
        // check heads.preMerge store to see if we now have the state needed to complete merge

        if (ready) {
          // <----- WIP-start----->
          console.warn('! WARNING ! - reducing merges safely is not yet fully working')
          // const preMergeTransformations = requiredKeys.map(nodeId => heads.preMerge.get(nodeId))
          const mergeTransformation = getT(nextId)

          // ALGORITHM:
          // is there a conflict between heads (preMergeTransformations) ?
          // - no: concat the heads, then concat result with mergeTransformation
          // - yes: does mergeTransformation resolves heads conflict?
          //    - yes: do it (TODO decide what merge is in the case of composition other than overwrite
          //    - no: throw out the merge....
          //
          //  functions needed:
          //  - [x] IsConflict(composition)(heads)
          //  - [x] Concat(composition)(heads)
          //  - [ ] IsValidMerge
          //
          //  intended direction:
          //  - build ComposeRule(composition), which has concat+merge methods

          queue.add({
            nodeId: nextId,
            // accT: nextT
            accT: mergeTransformation
          })
          // this just treats merge like an overwrite (ignoring all transformations so far)
          // and for all properties, which is wrong because it ignores invalid merges, and over-writes un-named values with identity

          // <----- WIP-end----->
        }
      }
    })
  }

  return heads.terminal
}
