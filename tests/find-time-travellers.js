const test = require('tape')
const Map = require('../lib/build-edge-map')
const Lookup = require('../lib/build-node-lookup')
const Find = require('../lib/find-time-travellers.js')

test('find-time-traveller: simple case', t => {
  //      A  (first)
  //      |
  //      B-----E (WARIO+21)   (E is naughty time-travel)
  //      |
  //      C
  //      |
  //      D (WARIO+20)

  const A = { key: 'A', author: 'mario', seq: 10, thread: { first: null, previous: null } }
  const B = { key: 'B', author: 'mario', seq: 11, thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', author: 'mario', seq: 23, thread: { first: 'A', previous: ['B'] } }
  const D = { key: 'D', author: 'WARIO', seq: 20, thread: { first: 'A', previous: ['C'] } }
  const E = { key: 'E', author: 'WARIO', seq: 21, thread: { first: 'A', previous: ['B'] } }

  const map1 = Map([A, B, C, D, E])
  const lookup1 = Lookup(map1, A, [B, C, D, E]).connected

  t.deepEqual(Find(map1, lookup1, 'A'), ['E'], 'simple case')
  t.end()
})
