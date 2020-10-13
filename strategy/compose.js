const Strategy = require('@tangle/strategy')

module.exports = function (composition) {
  console.warn('please use @tangle/strategy instead. NOTE is has a slightly different API')
  return new Strategy(composition)
}
