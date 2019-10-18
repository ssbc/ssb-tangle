const test = require('tape')
const Rule = require('../../strategy/overwrite')

test('strategy/overwrite', t => {
  const {
    isTransformation,
    reify,
    concat,
    identity,
    isConflict,
    isValidMerge
    // merge
  } = Rule()

  // isTransformation /////////////////////////////

  const Ts = [
    { set: 'hello' },
    { set: 'bart was here' },
    { set: '' },
    { set: true },
    { set: null },
    { set: { content: 'dog' } },
    { set: 5 },
    identity()
  ]
  Ts.forEach(T => {
    t.true(isTransformation(T), `isTransformation : ${JSON.stringify(T)}`)
  })

  const notTs = [
    'dog',
    { content: 'dog' },
    undefined,
    { set: undefined }
  ]
  notTs.forEach(T => {
    t.false(isTransformation(T), `!isTransformation : ${JSON.stringify(T)}`)
  })

  // reify /////////////////////////////

  t.deepEqual(
    Ts.map(reify),
    [
      'hello',
      'bart was here',
      '',
      true,
      null,
      { content: 'dog' },
      5,
      identity()
    ],
    'reify transformation (general + identity)'
  )

  // concat, identity + associativity /////////////////////////////

  t.equal(concat(identity(), Ts[0]), Ts[0], 'identiy (left)')
  t.equal(concat(Ts[0], identity()), Ts[0], 'identity (right)')

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

  // merging stuff! ///////////////////////////

  const A = () => ({ set: 'dog' })
  const B = () => ({ set: 'cat' })
  const C = () => ({ set: 'cat-dog' }) // our merge message

  // check whether there's any conflict between n heads
  t.equal(isConflict([A(), A()]), false, 'no conflict')
  t.equal(isConflict([A(), identity()]), false, 'no conflict (identity)')
  t.equal(isConflict([A(), identity(), A()]), false, 'no conflict (3-way)')

  t.equal(isConflict([A(), B()]), true, 'isConflict')
  t.equal(isConflict([A(), A(), B()]), true, 'isConflict (3 way)')

  // check in on which sorts of merge require a merge message, and what that looks like
  t.equal(isValidMerge([A(), B()], C()), true, 'mege which resolves conflict is fine')
  t.equal(isValidMerge([A(), B()], identity()), false, 'merge which does not resolve conflict invalid')
  t.equal(isValidMerge([A(), identity()], identity()), true, 'identity merge is fine for non-conflict')

  t.end()
})
