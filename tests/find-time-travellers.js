const test = require('tape')
const Map = require('../lib/build-edge-map')
const Lookup = require('../lib/build-node-lookup')
const Find = require('../lib/find-time-travellers.js')

test('find-time-traveller', t => {
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

  /// ///////////////////////////////////////////////////////////////////////

  //               A  (first)
  //              / \
  //             B   C
  //            /   /
  // WARIO+30  D   E  WARIO+65

  const messages = [
    { key: 'A', author: 'mario', seq: 10, thread: { first: null, previous: null } },
    { key: 'B', author: 'mario', seq: 11, thread: { first: 'A', previous: ['A'] } },
    { key: 'C', author: 'luigi', seq: 24, thread: { first: 'A', previous: ['A'] } },
    { key: 'D', author: 'WARIO', seq: 30, thread: { first: 'A', previous: ['B'] } },
    { key: 'E', author: 'WARIO', seq: 65, thread: { first: 'A', previous: ['C'] } }
  ]

  const map2 = Map(messages)
  const first2 = messages.shift()
  const lookup2 = Lookup(map2, first2, messages).connected

  t.deepEqual(Find(map2, lookup2, 'A'), ['E'], 'more complex case')
  t.end()
})

test('find-time-traveller: annoying case', { todo: true }, t => {
  // not sure if this is time travel....
  // it's more like WARIO refusing to publish a merge message, which may not be that evil?

  //               A  (first)
  //              / \
  //   WARIO+30  D   C
  //                /
  //               E  WARIO+65

  // const messages = [
  //   { key: 'A', author: 'mario', seq: 10, thread: { first: null, previous: null } },
  //   { key: 'D', author: 'WARIO', seq: 30, thread: { first: 'A', previous: ['B'] } },
  //   { key: 'C', author: 'luigi', seq: 24, thread: { first: 'A', previous: ['A'] } },
  //   { key: 'E', author: 'WARIO', seq: 65, thread: { first: 'A', previous: ['C'] } }
  // ]

  // const map3 = Map(messages)
  // const first3 = messages.shift()
  // const lookup3 = Lookup(map3, first3, messages).connected

  // t.deepEqual(Find(map3, lookup3, 'A'), ['E'], 'unsolved case')
  // !!! currently fails ... but that's ok?
  t.end()
})