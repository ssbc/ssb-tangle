const isEqual = require('lodash.isequal')
const assert = require('assert').strict

function OverwriteStrategy () {
  const IDENTITY = null

  function concat (a, b) {
    if (!isTransformation(a)) throw new Error('cannot concat invalid transformation', a)
    if (!isTransformation(b)) throw new Error('cannot concat invalid transformation', b)

    if (b === IDENTITY) return a
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

    if (isConflict(heads)) return merge !== IDENTITY
    // there's a conflict across the heads the merge MUST resolve

    return true
    // can apply all changes
  }

  function merge (heads, merge) {
    assert(Array.isArray(heads))

    // this is a crude merge strategy - the merge message over-writes all history to date
    // in this strategy that's totally fine.
    // In other cases ideally the merge message is a "patch" which replaces only the
    // branched section of the graph

    // if (isConflict(heads)) return merge
    // TODO check all permutations of heads !

    return merge
  }

  return {
    identity: IDENTITY,
    Transformation,
    isTransformation,
    concat,
    isConflict,
    isValidMerge,
    merge
    // resolve // (act)
  }
}

function Transformation (content) {
  if (content === undefined) return null

  return content
}

function isTransformation (T) {
  if (T === null) return true

  switch (typeof T) {
    case 'string': return true
    case 'object': return true
    case 'number': return true
    case 'boolean': return true
    default:
      return false
  }
}

module.exports = OverwriteStrategy
