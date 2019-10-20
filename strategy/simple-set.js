// This made for modelling Sets made up of Strings
//
// I've chosen to make it *commutative* (transformation order doesn't matter)
// Implications of this are:
// - no merge conflicts!
// - more concise transformations
// - reified output is always alphabetically sorted

const IDENTITY = {}

function Rule () {
  // transformations are of form:
  // - { String: Integer }
  // - {} (identity)

  function isTransformation (T) {
    if (isIdentity(T)) return true

    if (T === null) return false
    if (typeof T !== 'object') return false

    return Object.values(T).every(weight => Number.isInteger(weight))
  }

  function reify (T) {
    if (!isTransformation(T)) throw Error('reify expects valid transformation')

    return Object.entries(T)
      .map(([entry, weight]) => {
        return weight > 0 ? entry : null
      })
      .filter(Boolean)
      .sort()
  }

  function concat (a, b) {
    if (!isTransformation(a)) throw Error('concat expects valid transformation')
    if (!isTransformation(b)) throw Error('concat expects valid transformation')

    var newT = Object.assign({}, a)
    Object.entries(b).forEach(([entry, weight]) => {
      if (!newT.hasOwnProperty(entry)) newT[entry] = weight
      else {
        const newWeight = newT[entry] + weight

        if (newWeight === 0) delete newT[entry]
        else newT[entry] = newWeight
      }
    })

    return newT
  }

  return {
    isTransformation,
    reify,
    identity: () => IDENTITY,
    concat
  }
}

function isIdentity (T) {
  if (T === null) return false
  if (typeof T !== 'object') return false
  if (Object.keys(T).length !== 0) return false

  return true
}

module.exports = Rule
