module.exports = function Concat (strategies) {
  return function (a, b) {
    var c = {}

    Object.entries(strategies).forEach(([prop, strategy]) => {
      c[prop] = strategy.concat(
        a[prop] || strategy.identity,
        b[prop] || strategy.identity
      )
    })

    return c
  }
}
