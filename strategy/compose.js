const Strategy = require('@tangle/strategy')

module.exports = function (composition) {
  return new Strategy(composition)
}
