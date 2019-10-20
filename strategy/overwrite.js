const isEqual = require('lodash.isequal')
const assert = require('assert').strict

function OverwriteRule (opts = {}) {
  const {
    identity = {},
    reifiedIdentiy = null
  } = opts

  function isTransformation (T) {
    // T is either identity, or { set: value }

    if (isIdentity(T)) return true

    if (T === undefined) return false
    if (typeof T !== 'object') return false

    switch (typeof T.set) {
      case 'string': return true
      case 'object': return true
      case 'number': return true
      case 'boolean': return true
      default:
        return false
    }
  }
  function isIdentity (T) {
    return isEqual(T, identity)
  }

  function reify (T) {
    if (isIdentity(T)) return reifiedIdentiy

    return T.set
  }

  function concat (a, b) {
    if (!isTransformation(a)) throw ConcatError(a)
    if (!isTransformation(b)) throw ConcatError(b)

    if (isIdentity(b)) return a
    return b
  }

  function isConflict (heads) {
    assert(Array.isArray(heads))

    // try merging the heads together checking commutative at each step
    // e.g. if (a*b) === (b*a) then these can be merged
    // then check if (a*b)*c === c*(a*b) etc.
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
    assert(Array.isArray(heads))

    if (isConflict(heads)) return !isEqual(merge, identity)
    // there's a conflict across the heads the merge MUST resolve

    return true
    // can apply all changes
  }

  // function merge (heads, merge) {
  //   assert(Array.isArray(heads))
  //
  //   // TODO
  //   // is there conflict
  //   // - no: concat heads, then concat merge
  //   // - yes: is merge valid (does it resolve conflict
  //   //    - yes: apply merge
  //   //    - no: drop the merge
  //   //
  //   // TODO remember could be > 2 heads
  //
  //   return merge
  // }
  //
  // NOTE - yes i think we do want a per-strategy merge

  return {
    identity: () => identity,
    reify,
    isTransformation,
    concat,
    isConflict,
    isValidMerge
    // merge
  }
}

function ConcatError (T) {
  return new Error(`cannot concat invalid transformation ${JSON.stringify(T)}`)
}

module.exports = OverwriteRule
