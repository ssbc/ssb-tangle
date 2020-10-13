const Reduce = require('@tangle/reduce')

module.exports = function reduce (entryNode, otherNodes, strategy, opts = {}) {
  console.warn('please use @tangle/reduce instead. NOTE is has a slightly different API')
  if (opts.getThread) {
    opts.getBacklinks = node => opts.getThread(node).previous
  }

  if (!opts.getBacklinks) {
    opts.getBacklinks = node => node.thread.previous
  }

  return Reduce([entryNode, ...otherNodes], strategy, opts)
}
