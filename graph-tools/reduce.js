const Reduce = require('@tangle/reduce')

module.exports = function reduce (entryNode, otherNodes, strategy, opts = {}) {
  console.warn('please use @tangle/reduce instead. NOTE is has a slightly different API')
  if (opts.getThread) {
    opts.getBacklinks = node => opts.getThread(node).previous
  }

  if (!opts.getBacklinks) {
    opts.getBacklinks = node => node.thread.previous
  }

  opts.node = [entryNode, ...otherNodes]
  return new Reduce(strategy, opts).state
}
