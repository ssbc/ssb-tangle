const assert = require('assert').strict

module.exports = function isRoot (node, getThread) {
  assert(node.key)

  return (getThread(node).root === null) &&
    (getThread(node).previous === null)
}
