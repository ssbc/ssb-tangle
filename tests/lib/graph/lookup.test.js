const test = require('tape')
const Lookup = require('../../../lib/graph/lookup.js')
const { Map } = require('../../../lib/graph/maps.js')

test('Lookup', t => {
  // ## message in-thread but "dangling" (doesn't link up to known messages)
  //
  //    A   (first)
  //    |
  //    B     ----?--- J? (a message we don't have)
  //    |              |
  //    C              K

  const A = { key: 'A', thread: { first: null, previous: null } }
  const B = { key: 'B', thread: { first: 'A', previous: ['A'] } }
  const C = { key: 'C', thread: { first: 'A', previous: ['B'] } }
  const K = { key: 'K', thread: { first: 'A', previous: ['J'] } }

  const map = Map([A, B, K, C])

  const result = Lookup(map, A, [B, C, K])
  const expected = {
    connected: { A, B, C },
    disconnected: { J: null, K }
  }

  t.deepEqual(result.connected, expected.connected, 'categorises connected')
  t.deepEqual(result.disconnected, expected.disconnected, 'categorises disconnected')
  t.deepEqual(result.getNode('A'), A, 'getNode')
  t.equal(result.getNode('Y'), undefined, 'getNode (invalid key)')

  t.end()
})
