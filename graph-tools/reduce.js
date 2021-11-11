const Reduce = require('@tangle/reduce')

let warnCount = 0
module.exports = function reduce (entryNode, otherNodes, strategy, opts = {}) {
  if (warnCount++ % 1000 === 0) console.warn('please use @tangle/reduce instead. NOTE is has a slightly different API')
  if (opts.getThread) {
    opts.getBacklinks = node => opts.getThread(node).previous
  }

  if (!opts.getBacklinks) {
    opts.getBacklinks = node => node.thread.previous
  }

  opts.nodes = [entryNode, ...otherNodes]
  return new Reduce(strategy, opts).state
}
