const assert = require('assert').strict

module.exports = function isFirst (node, getThread) {
  assert(node.key)

  return (getThread(node).first === null) &&
    (getThread(node).previous === null)
}
