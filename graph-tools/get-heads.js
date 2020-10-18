const reduce = require('@tangle/reduce')

module.exports = function getHeads (entryNode, otherNodes, opts = {}) {
  const strategy = opts.strategy || {
    pureTransformation: noop,
    concat: noop
  }

  if (opts.getThread) {
    opts.getBacklinks = node => opts.getThread(node).previous
  }

  if (!opts.getBacklinks) {
    opts.getBacklinks = node => node.thread.previous
  }

  const headStates = reduce([entryNode, ...otherNodes], strategy, opts)
  // using reduce might be overkill at the moment, but depends on whether
  // people need to graph as it's built before determining "heads'

  return Object.keys(headStates)
}

function noop () {}
