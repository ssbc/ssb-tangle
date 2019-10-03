const test = require('tape')
const Strategy = require('../../strategies/overwrite')

test('overwrite strategy', t => {
  const strategy = Strategy()
  const {
    identity,
    buildTransformation,
    isTransformation,
    concat,
    isConflict
  } = strategy

  t.true(typeof identity, 'has identity')

  const Ts = [
    'hello',
    'bart was here',
    ''
  ].map(buildTransformation)
  Ts.push(identity)

  t.true(Ts.every(isTransformation), 'validates transformations')

  t.equal(concat(identity, Ts[0]), Ts[0], 'identiy (left)')
  t.equal(concat(Ts[0], identity), Ts[0], 'identity (right)')

  t.equal(
    concat(
      concat(Ts[0], Ts[1]),
      Ts[2]
    ),
    concat(
      Ts[0],
      concat(Ts[1], Ts[2])
    ),
    'associativity'
  )

  const A = () => buildTransformation('dog')
  const B = () => buildTransformation('cat')

  t.equal(isConflict([A(), A()]), false, 'no conflict')
  t.equal(isConflict([A(), identity]), false, 'no conflict (identity)')
  t.equal(isConflict([A(), identity, A()]), false, 'no conflict (3-way)')

  t.equal(isConflict([A(), B()]), true, 'isConflict')
  t.equal(isConflict([A(), A(), B()]), true, 'isConflict (3 way)')

  t.end()
})
