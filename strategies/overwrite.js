const isEqual = require('lodash.isequal')

function OverwriteStrategy () {
  const IDENTITY = null

  function concat (a, b) {
    if (!isTransformation(a)) throw new Error('cannot concat invalid transformations')
    if (!isTransformation(b)) throw new Error('cannot concat invalid transformations')

    if (b === IDENTITY) return a
    return b
  }

  function isConflict (heads) {
    // try merging the heads together checking commutative at each step
    // e.g. if (A*B) === (B*A) then these can be merged
    // then check if (A*B)*C === C*(A*B) etc.
    // as long as set is associative with concat, then checking like this
    // means we are checking all possible permutations of head merging

    var _heads = [...heads]
    var a = _heads.pop()

    while (_heads.length) {
      var b = _heads.pop()

      if (!isEqual(concat(a, b), concat(b, a))) return true
      a = concat(a, b)
    }
    return false
  }

  function isValidMerge (heads, merge) {
    if (isConflict(heads)) return merge !== IDENTITY
    // there's a conflict across the heads the merge MUST resolve

    else return true
    // can apply all changes
  }

  function merge (heads, merge) {
    // this is a crude merge strategy - the merge message over-writes all history to date
    // in this strategy that's totally fine.
    // In other cases ideally the merge message is a "patch" which replaces only the
    // branched section of the graph

    // if (isConflict(heads)) return merge
    // TODO check all permutations of heads!

    return merge
  }

  function buildTransformation (string) {
    if (string === null) return null

    return { type: '>', payload: string }
  }

  function isTransformation (T) {
    // replace with JSON-schema validator
    if (T === null) return true

    if (typeof T !== 'object') return false
    if (T.type !== '>') return false
    if (typeof T.payload !== 'string') return false

    return true
  }

  return {
    identity: IDENTITY,
    buildTransformation,
    isTransformation,
    concat,
    isConflict,
    isValidMerge,
    merge
    // resolve // (act)
  }
}

module.exports = OverwriteStrategy
