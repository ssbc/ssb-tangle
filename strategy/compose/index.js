const Reify = require('./reify')
const Concat = require('./concat')
// const IsConflict = require('./is-conflict')
// const IsTransformation = require('./is-transformation')

module.exports = function StrategyCompose (composition) {
  // TODO validate each strategy
  // - does each one have required methods?
  // - perhaps leave that to each sub-method to define

  return {
    pureTransformation: PureTransformation(composition),
    reify: Reify(composition),
    concat: Concat(composition)
    // isConflict: IsConflict(composition),
    // isValidMerge: IsValidMerge(composition)
    // isTransformation: IsTransformation(composition), ?
    // identity ?
  }
}

function PureTransformation (composition) {
  return function (T) {
    // take an Object T, which may have supurflous or missing transformation fields
    // and creates from it a clean + explicit transformation, fullT

    var fullT = {}

    Object.entries(composition).forEach(([field, strategy]) => {
      fullT[field] = T[field] || strategy.identity()
    })

    return fullT
  }
}
