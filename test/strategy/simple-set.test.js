const test = require('tape')
const Rule = require('../../strategy/simple-set')

test('strategy/simple-set', t => {
  const {
    isTransformation,
    reify,
    concat,
    identity
    // isConflict,
    // isValidMerge
    // merge
  } = Rule()

  // isTransformation /////////////////////////////

  const Ts = [
    { faerie: 1 },
    { faerie: 0 },
    { faerie: -1 },
    { faerie: 1, taniwha: 2 },
    { taniwha: 2, faerie: 1 }, // order-invariance
    { faeire: 0, taniwha: 2 },
    identity() // {}
  ]
  Ts.forEach(T => {
    t.true(isTransformation(T), `isTransformation : ${JSON.stringify(T)}`)
  })

  const notTs = [
    'dog',
    undefined,
    null,
    true,
    { faeire: 2.5 },
    { faerie: 'duck' },
    { faerie: null },
    { faerie: true },
    { cat: 2, faerie: undefined },
    { faerie: undefined }
  ]
  notTs.forEach(T => {
    t.false(isTransformation(T), `!isTransformation : ${JSON.stringify(T)}`)
  })

  // reify /////////////////////////////

  t.deepEqual(
    Ts.map(reify),
    [
      ['faerie'], // { faeire: 1 },
      [], // { faeire: 0 },
      [], // { faeire: -1 },
      ['faerie', 'taniwha'], // { faerie: 1, taniwha: 2 },
      ['faerie', 'taniwha'], // { taniwha: 1, faerie: 2 }, order-invariance
      ['taniwha'], // { faeire: 0, taniwha: 2 },
      [] // identity() // {}
    ],
    'reify transformation (general + identity)'
  )

  // // concat, identity + associativity /////////////////////////////

  t.deepEqual(concat(identity(), { a: 1 }), { a: 1 }, 'identiy (left)')
  t.deepEqual(concat({ a: 1 }, identity()), { a: 1 }, 'identity (right)')

  const A = { a: 1 }
  const B = { a: 1, b: 1 }
  const C = { b: 1, c: 1 }

  t.deepEqual(
    concat(concat(A, B), C),
    concat(A, concat(B, C)),
    'associativity'
  )

  // BONUS: inverses
  const T1 = { a: 1 }
  const T2 = { a: -1 }
  t.deepEqual(concat(T1, T2), identity(), 'inverse (part I)')
  t.deepEqual(concat(T2, T1), identity(), 'inverse (part II)')

  // BONUS: commutative
  const U1 = { a: 1, b: 3, c: -2 }
  const U2 = { a: 2, b: -1, c: 2 }
  t.deepEqual(concat(U1, U2), concat(U2, U1), 'commutative')

  // merging stuff! ///////////////////////////

  // const A = () => ({ set: 'dog' })
  // const B = () => ({ set: 'cat' })
  // const C = () => ({ set: 'cat-dog' }) // our merge message

  // // check whether there's any conflict between n heads
  // t.equal(isConflict([A(), A()]), false, 'no conflict')
  // t.equal(isConflict([A(), identity()]), false, 'no conflict (identity)')
  // t.equal(isConflict([A(), identity(), A()]), false, 'no conflict (3-way)')

  // t.equal(isConflict([A(), B()]), true, 'isConflict')
  // t.equal(isConflict([A(), A(), B()]), true, 'isConflict (3 way)')

  // // check in on which sorts of merge require a merge message, and what that looks like
  // t.equal(isValidMerge([A(), B()], C()), true, 'mege which resolves conflict is fine')
  // t.equal(isValidMerge([A(), B()], identity()), false, 'merge which does not resolve conflict invalid')
  // t.equal(isValidMerge([A(), identity()], identity()), true, 'identity merge is fine for non-conflict')

  t.end()
})
