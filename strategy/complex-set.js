const isEqual = require('lodash.isequal')
const isEmpty = require('lodash.isempty')
const { isFeed } = require('ssb-ref')

const IDENTITY = {}

function ComplexSetRule () {
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
    var res = {}
  
    Object.entries(T).forEach(([key, value]) => {
      const events = Object.entries(value)
        .map(([seq, state]) => [Number(seq), state])
        .sort((a, b) => a[0] - b[0])

      var isAdd = true
      var interval = new Interval()

      var history = []

      while (events.length) {
        var [seq, state] = events.shift()
        if (isAdd && state > 0) {
          interval.start = seq
          isAdd = false
        } else if (!isAdd && state <= 0) {
          interval.end = seq
          isAdd = true
          history.push(interval)
          interval = new Interval()
        }
      }

      if (interval.start) history.push(interval)
      if (history.length) res[key] = history
    })

    
    return res
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

function Interval () {
  return { start: null, end: null }
}

function isValidKey (key) {
  if (typeof key === 'string') key = parseInt(key)
  return Number.isInteger(key) && key > 0
}

function isValidValue (value) {
  return Number.isInteger(value)
}

module.exports = ComplexSetRule
