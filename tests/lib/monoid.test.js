const test = require('tape')
const Monoid = require('../../lib/monoid')

test('stringMonoid', t => {
  const t1 = { type: 'set', data: 'hello world' }
  const t2 = { type: 'set', data: 'hello buttz!' }
  const t3 = { type: 'set', data: 'scuttle buttz!' }

  const { concat, identity, canMerge } = Monoid.stringMonoid

  t.deepEqual(concat(identity(), t1), t1, 'left Identity')
  t.deepEqual(concat(t1, identity()), t1, 'right Identity')
  t.deepEqual(concat(concat(t1, t2), t3), concat(t1, concat(t2, t3)), 'associativity')

  t.deepEqual(concat(t1, t2), t2, 'concat')
  t.true(canMerge(t1, t1), 'canMerge')
  t.false(canMerge(t1, t2), 'canMerge')

  t.end()
})

// this is a monoid which can be mapped to a Set
test('setMonoid (add)', t => {
  const { concat, identity, canMerge } = Monoid.setMonoid

  const t1 = { type: 'add', data: { '@mix': 1 } }
  const t2 = { type: 'add', data: { '@bundy': 1, '@aljoscha': 1 } }
  const t3 = { type: 'add', data: { '@mix': -1 } }

  t.deepEqual(concat(identity(), t1), t1, 'left Identity (add)')
  t.deepEqual(concat(t1, identity()), t1, 'right Identity (add)')

  t.deepEqual(concat(concat(t1, t2), t3), concat(t1, concat(t2, t3)), 'associativity')
  t.deepEqual(concat(t1, t2), concat(t2, t1), 'commutative')
  t.deepEqual(concat(t1, t3), identity(), 'inverses!')

  t.deepEqual(concat(t1, t2), { type: 'add', data: { '@mix': 1, '@bundy': 1, '@aljoscha': 1 } }, 'concat (add)')

  t.true(canMerge(t1, t1), 'canMerge')
  // t.false(canMerge(t1, t3), 'canMerge (touching same key)')

  t.end()
})

// this is a last-updated-at monoid
test('mapMonoid (set)', t => {
  const { concat, identity, canMerge } = Monoid.mapMonoid

  const t1 = { type: 'set', data: { '@mix': 343 } }
  const t2 = { type: 'set', data: { '@bundy': 22, '@aljoscha': 12355 } }
  const t3 = { type: 'set', data: { '@mix': 20500 } }

  t.deepEqual(concat(identity(), t1), t1, 'left Identity (add)')
  t.deepEqual(concat(t1, identity()), t1, 'right Identity (add)')

  t.deepEqual(concat(concat(t1, t2), t3), concat(t1, concat(t2, t3)), 'associativity')

  t.deepEqual(concat(t1, t2), { type: 'set', data: { '@mix': 343, '@bundy': 22, '@aljoscha': 12355 } }, 'concat (add)')
  t.deepEqual(concat(t1, t3), { type: 'set', data: { '@mix': 20500 } }, 'concat (add)')

  t.true(canMerge(t1, t1), 'canMerge')
  // t.false(canMerge(t1, t3), 'canMerge (touching same key)')

  t.end()
})

  // const t1 = {
  //   type: 'add',
  //   data: [
  //     { author: '@mix', start: 343, stop: null }
  //   ]
  // }
  // const t2 = {
  //   type: 'add',
  //   data: [
  //     { author: '@mix', start: null, stop: 400 },
  //     { author: '@alj', start: 255, stop: null },
  //   ]
  // }
  // const t2 = { type: 'set', data: { '@bundy': 22, '@aljoscha': 12355 } }
  // const t3 = { type: 'set', data: { '@mix': 20500 } }




test('Monoid#compose', { todo: true }, t => {
  t.end()
})
