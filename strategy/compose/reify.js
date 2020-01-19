const isEqual = require('lodash.isequal')

module.exports = function Reify (composition) {
  // composition is an Object made up of several strategy
  validate(composition)

  return function (T) {
    // T is an Object made up of transformations

    var result = {}

    Object.entries(composition)
      .forEach(([field, strategy]) => {
        const { reify, identity } = strategy

        result[field] = null
        if (field in T && !isEqual(T[field], identity())) {
          result[field] = reify(T[field])
        } else {
          result[field] = reify(identity())
        }
      })

    return result
  }
}

function validate (composition) {
  Object.entries(composition).forEach(([name, strategy]) => {
    if (typeof strategy.reify !== 'function') throw Error(`strategy for ${name} must have a reify method`)
    if (typeof strategy.identity !== 'function') throw Error(`strategy for ${name} must have an identity method`)

    if (strategy.identity() === undefined) throw Error(`strategy for ${name} cannot have an identity element equal to "undefined"`)
  })
}
