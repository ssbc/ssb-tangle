const isEqual = require('lodash.isequal')
const isEmpty = require('lodash.isempty')
const { isFeed } = require('ssb-ref')

const IDENTITY = {}

function KaitiakiRule () {
  /*
    transformations are of form:  
    {
      String: { Integer: Integer }
    }
  */

  function isTransformation (T) {
    if (isIdentity(T)) return true

    if (isEmpty(T)) return false
    if (T === null) return false
    if (typeof T !== 'object') return false

    return Object.entries(T).every(([key, value]) => {
      return isFeed(key) && isValidEntry(value)
    })
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

function isValidEntry (obj) {
  if (isEmpty(obj)) return false
  if (obj === null || obj === undefined) return false
  if (typeof obj !== 'object') return false

  return Object.entries(obj).every(([key, value]) => {
    return isValidKey(key) && isValidValue(value)
  })
}

function isValidKey (key) {
  if (typeof key === 'string') key = parseInt(key)
  return Number.isInteger(key) && key > 0
}

function isValidValue (value) {
  return Number.isInteger(value)
}

module.exports = KaitiakiRule
