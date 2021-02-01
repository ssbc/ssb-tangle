const Strategy = require('@tangle/strategy')
const Reduce = require('@tangle/reduce')

module.exports = function getHeads (entryNode, otherNodes, opts = {}) {
  const strategy = opts.strategy || new Strategy({})

  if (opts.getThread) {
    opts.getBacklinks = node => opts.getThread(node).previous
  }

  if (!opts.getBacklinks) {
    opts.getBacklinks = node => node.thread.previous
  }

  opts.nodes = [entryNode, ...otherNodes]

  const reduce = new Reduce(strategy, opts)
  // using reduce might be overkill at the moment, but depends on whether
  // people need to graph as it's built before determining "heads'

  return Object.keys(reduce.state)
}
