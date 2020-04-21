// const IsTransformation = require('./is-transformation')
const Reify = require('./reify')
const Concat = require('./concat')
// const IsConflict = require('./is-conflict')

module.exports = function StrategyCompose (composition) {
  // TODO validate each strategy
  // - does each one have required methods?
  // - perhaps leave that to each sub-method to define

  return {
    pureTransformation: PureTransformation(composition),
    // - want this so anyone can give a node to this Strategy thing and get transformation back
    // isTransformation: IsTransformation(composition),
    // identity ?
    reify: Reify(composition),
    concat: Concat(composition)
    // isConflict: IsConflict(composition),
    // isValidMerge: IsValidMerge(composition)
  }
}

function PureTransformation (composition) {
  return function (S) {
    // take an Object S, which may have supurflous or missing fields
    // and create from it a clear explicit transformation, T
    var T = {}

    Object.entries(composition).forEach(([field, strategy]) => {
      T[field] = field in S
        ? S[field]
        : strategy.identity()
    })

    return T
  }
}
