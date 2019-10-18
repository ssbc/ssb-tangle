const test = require('tape')
const prune = require('../../graph/prune-map')

//      A  (root)
//     / \
//    B   C
//   /   / \
//  D   E   F
//   \ /     \
//    H       G
//    |
//    I

const getMap = () => ({
  A: { B: 1, C: 1 },
  B: { D: 1 },
  C: { E: 1, F: 1 },
  D: { H: 1 },
  E: { H: 1 },
  F: { G: 1 },
  H: { I: 1 }
})

test('prune-map', t => {
  // say C is invalid, result:
  //
  //      A  (root)
  //     /
  //    B
  //   /
  //  D

  const e1 = {
    A: { B: 1 },
    B: { D: 1 }
  }

  t.deepEqual(prune(getMap(), 'A', ['C']), e1, 'simple prune')
  t.deepEqual(prune(getMap(), 'A', ['C', 'H']), e1, 'simple prune (redundent invalid nodes)')

  // say D is invalid, result :
  //
  //      A  (root)
  //     / \
  //    B   C
  //       / \
  //      E   F
  //           \
  //            G

  const e2 = {
    A: { B: 1, C: 1 },
    C: { E: 1, F: 1 },
    F: { G: 1 }
  }

  t.deepEqual(prune(getMap(), 'A', ['D']), e2, 'a different invalidation')

  t.end()
})
