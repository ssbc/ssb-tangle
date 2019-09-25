const test = require('tape')
const sort = require('../lib/connection-sort')
const Map = require('../lib/build-map')

test('connectionSort', t => {
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

  const expected = {
    connected: { A, B, C },
    disconnected: { J: null, K }
  }

  t.deepEqual(sort(map, A, [B, C, K]), expected, 'categorises connected/ disconnected')

  t.end()
})
