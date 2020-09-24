const isEqual = require('lodash.isequal')

const IDENTITY = {
  add: [],
  remove: []
}

function KaitiakiRule () {
  // Entry = { feed: String, seq: Integer }
  // transformations are of form:
  // - { add: [], remove: []} (identity)
  // - { add: [Entry], remove: [Entry] }
  // - { add: [Entry], remove: [] }
  // - { add: [], remove: [Entry] }
  

  function isTransformation (T) {
    if (isIdentity(T)) return true

    if (T === null) return false
    if (typeof T !== 'object') return false
    if (Object.keys(T).length !== 2) return false
    
    const { add, remove } = T

    if (!isValidArray(add) || !isValidArray(remove)) return false
  
    return true
  }

  function reify (T) {
  }

  function concat (a, b) {
  }

  return {
    isTransformation,
    reify,
    identity: () => IDENTITY,
    concat
  }
}

function isIdentity (T) {
  return isEqual(T, IDENTITY)
}

function isValidArray (array) {
  if (!array || !Array.isArray(array)) return false

  return !array.some(d => {
    return !(d.feed && d.seq && typeof d.feed === 'string' && Number.isInteger(d.seq))
  })
}

module.exports = KaitiakiRule
