const Reduce = require('@tangle/reduce')

module.exports = function reduce (entryNode, otherNodes, strategy, opts = {}) {
  if (opts.getThread) {
    opts.getBacklinks = node => opts.getThread(node).previous
  }

  if (!opts.getBacklinks) {
    opts.getBacklinks = node => node.thread.previous
  }

  return Reduce([entryNode, ...otherNodes], strategy, opts)
}
