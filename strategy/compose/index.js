// const IsTransformation = require('./is-transformation')
const Reify = require('./reify')
const Concat = require('./concat')
// const IsConflict = require('./is-conflict')

module.exports = function RuleCompose (composition) {
  // TODO validate each strategy
  // - does each one have required methods?
  // - perhaps leave that to each sub-method to define

  return {
    // getTransformation: GetTransformation(composition),
    //    - want this so anyone can give a node to this Rules thing and get transformation back
    // isTransformation: IsTransformation(composition),
    reify: Reify(composition),
    concat: Concat(composition)
    // isConflict: IsConflict(composition),
    // isValidMerge: IsValidMerge(composition)
  }
}
