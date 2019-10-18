const test = require('tape')
const Graph = require('../../graph')
const Find = require('../../graph-tools/find-time-travellers.js')

test('find-time-traveller', t => {
  //      A  (root)
  //      |
  //      B-----E (WARIO+21)   (E is naughty time-travel)
  //      |
  //      C
  //      |
  //      D (WARIO+20)

  const A = { key: 'A', author: 'mario', seq: 10, thread: { root: null, previous: null } }
  const B = { key: 'B', author: 'mario', seq: 11, thread: { root: 'A', previous: ['A'] } }
  const C = { key: 'C', author: 'mario', seq: 23, thread: { root: 'A', previous: ['B'] } }
  const D = { key: 'D', author: 'WARIO', seq: 20, thread: { root: 'A', previous: ['C'] } }
  const E = { key: 'E', author: 'WARIO', seq: 21, thread: { root: 'A', previous: ['B'] } }

  const graph = Graph(A, [B, C, D, E])

  t.deepEqual(Find(graph), ['E'], 'simple case')

  /// ///////////////////////////////////////////////////////////////////////

  //               A  (root)
  //              / \
  //             B   C
  //            /   /
  // WARIO+30  D   E  WARIO+65

  const messages = [
    { key: 'A', author: 'mario', seq: 10, thread: { root: null, previous: null } },
    { key: 'B', author: 'mario', seq: 11, thread: { root: 'A', previous: ['A'] } },
    { key: 'C', author: 'luigi', seq: 24, thread: { root: 'A', previous: ['A'] } },
    { key: 'D', author: 'WARIO', seq: 30, thread: { root: 'A', previous: ['B'] } },
    { key: 'E', author: 'WARIO', seq: 65, thread: { root: 'A', previous: ['C'] } }
  ]

  const initial = messages.shift()

  const graph2 = Graph(initial, messages)

  t.deepEqual(Find(graph2), ['E'], 'more complex case')
  t.end()
})

test('find-time-traveller: annoying case', { todo: true }, t => {
  // not sure if this is time travel....
  // it's more like WARIO refusing to publish a merge message, which may not be that evil?

  //               A  (root)
  //              / \
  //   WARIO+30  D   C
  //                /
  //               E  WARIO+65

  // const messages = [
  //   { key: 'A', author: 'mario', seq: 10, thread: { root: null, previous: null } },
  //   { key: 'D', author: 'WARIO', seq: 30, thread: { root: 'A', previous: ['B'] } },
  //   { key: 'C', author: 'luigi', seq: 24, thread: { root: 'A', previous: ['A'] } },
  //   { key: 'E', author: 'WARIO', seq: 65, thread: { root: 'A', previous: ['C'] } }
  // ]

  // const map3 = Map(messages)
  // const root3 = messages.shift()
  // const lookup3 = Lookup(map3, root3, messages).connected

  // t.deepEqual(Find(map3, lookup3, 'A'), ['E'], 'unsolved case')
  // !!! currently fails ... but that's ok?
  t.end()
})
