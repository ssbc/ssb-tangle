const test = require('tape')
const ComplexSetRule = require('../../strategy/complex-set')

test('strategy/complex-set', t => {
  const {
    isTransformation,
    reify,
    concat,
    identity
  } = ComplexSetRule()

  const chereseFeedId = '@chereseqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519'
  const mixFeedId = '@mixVv6k5mnWKkJTgCIpqOsA4JeJd9Oz2gmv6rojQeXU=.ed25519'
  const benFeedId = '@bengCIpqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519'

  // isTransformation /////////////////////////////

  const Ts = [
    { // simple add
      [chereseFeedId]: { 100: 1 }
    },
    {
      [chereseFeedId]: { 100: 0 }
    },
    { // simple remove
      [chereseFeedId]: { 500: -1 }
    },
    {
      [mixFeedId]: { 100: 1 },
      [benFeedId]: { 200: 2 }
    },
    { // order-invariance
      [mixFeedId]: { 100: 2 },
      [benFeedId]: { 200: 1 }
    },
    
    { // mutiple feeds same seq
      [mixFeedId]: { 100: 0 },
      [benFeedId]: { 200: 2 }
    },
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
    {
      [chereseFeedId]: { 200: 2.5 }
    },
    {
      [chereseFeedId]: { 200: 'duck' }
    },
    {
      [chereseFeedId]: { 200: null }
    },
    {
      [chereseFeedId]: { 200: true }
    },
    {
      [chereseFeedId]: { 200: 2, 300: undefined }
    },
    {
      [chereseFeedId]: { 200: undefined }
    },
    {
      [chereseFeedId]: { 'dog': 1 } // invalid seq value
    },
    {
      'dog': { 200: 1 } // invalid feedId string
    }
  ]

  notTs.forEach(T => {
    t.false(isTransformation(T), `!isTransformation : ${JSON.stringify(T)}`)
  })

  t.end()
})
