module.exports = function Concat (composition) {
  // composition is an Object made up of several strategy
  validate(composition)

  return function (a, b) {
    var c = {}

    Object.entries(composition).forEach(([field, strategy]) => {
      if (!a[field] && !b[field]) return // eslint-disable-line
      else if (!a[field]) c[field] = b[field]
      else if (!b[field]) c[field] = a[field]
      else {
        c[field] = strategy.concat(a[field], b[field])
      }
    })

    return c
  }
}

function validate (composition) {
  Object.entries(composition).forEach(([name, strategy]) => {
    if (typeof strategy.concat !== 'function') throw Error(`strategy for ${name} must have a concat method`)
  })
}
