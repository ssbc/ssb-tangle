const test = require('tape')
const Strategy = require('../../strategies/overwrite')

test('overwrite strategy', t => {
  const strategy = Strategy()
  const {
    identity,
    buildTransformation,
    isTransformation,
    concat,
    isConflict,
    isValidMerge,
    merge
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
  const C = () => buildTransformation('cat-dog') // our merge message

  // check whether there's any conflict between n heads
  t.equal(isConflict([A(), A()]), false, 'no conflict')
  t.equal(isConflict([A(), identity]), false, 'no conflict (identity)')
  t.equal(isConflict([A(), identity, A()]), false, 'no conflict (3-way)')

  t.equal(isConflict([A(), B()]), true, 'isConflict')
  t.equal(isConflict([A(), A(), B()]), true, 'isConflict (3 way)')

  // check in on which sorts of merge require a merge message, and what that looks like
  t.equal(isValidMerge([A(), B()], C()), true)
  t.equal(isValidMerge([A(), identity], identity), true)
  t.equal(isValidMerge([A(), B()], identity), false)

  t.end()
})
