const isEqual = require('lodash.isequal')
// const { combination } = require('js-combinatorics')

function OverwriteStrategy () {
  // const {
  //   buildTransformation = _buildTransformation,
  //   isTransformation = _isTransformation
  // } = opts
  const IDENTITY = null

  function concat (a, b) {
    if (!isTransformation(a)) throw new Error('cannot concat invalid transformations')
    if (!isTransformation(b)) throw new Error('cannot concat invalid transformations')

    if (b === IDENTITY) return a
    return b
  }

  function isConflict (heads) {
    // TODO check all permutations of heads!
    var _heads = [...heads]
    var a = _heads.pop()

    while (_heads.length) {
      var b = _heads.pop()

      if (!isEqual(concat(a, b), concat(b, a))) return true
      a = concat(a, b)
    }
    return false

    // const combos = combination(heads, 2)
    // var combo = combos.next()
    // while (combo) {
    //   if (!isEqual(concat(combo[0], combo[1]), concat(combo[1], combo[0]))) return true
    //   combo = combos.next()
    // }

    // return false
  }

  function isValidMerge (merge, heads) {
    // if (isConflict(heads))
  }

  function merge (merge, heads) {
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
