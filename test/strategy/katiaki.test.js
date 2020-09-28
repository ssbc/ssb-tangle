const test = require('tape')
const KaitiakiRule = require('../../strategy/kaitiaki')

test('strategy/kaitiaki', t => {
  const {
    isTransformation,
    reify,
    concat,
    identity
  } = KaitiakiRule()

  // isTransformation /////////////////////////////

  const Ts = [
    { // simple add
      '@chereseqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        100: 1
      }
    },
    { // simple remove
      '@chereseqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        500: -1
      }
    },
    { // multiple adds in a row
      '@chereseqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        100: 1, // cherese added at seq 100 by mix
        300: 1  // added again at seq 300 later on by ben
      }
    },
    { // muliple feeds different seq
      '@mixVv6k5mnWKkJTgCIpqOsA4JeJd9Oz2gmv6rojQeXU=.ed25519': {
        100: 1 // mix added at seq 100
      },
      '@bengCIpqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        150: 1 // ben added after mix at seq 150
      }
    },
    { // mutiple feeds same seq
      '@mixVv6k5mnWKkJTgCIpqOsA4JeJd9Oz2gmv6rojQeXU=.ed25519': {
        100: 1
      },
      '@bengCIpqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        100: 1
      }
    },
    { // multiple removes in a row
      '@bengCIpqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        200: 1, // ben added at seq 200
        550: -1, // remove at seq 550 (by cherese)
        500: -1 // removed at seq 500 (by mix who was out of the loop)
      }
    },
    {
      '@bengCIpqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        100: 1,
        200: 2
      }
    },
    {
      '@bengCIpqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        100: 2,
        200: 1
      }
    },
    {
      '@bengCIpqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        500: 1,
        100: 2
      }
    },
    identity() // {}
  ]

  Ts.forEach(T => {
    t.true(isTransformation(T), `isTransformation : ${JSON.stringify(T)}`)
  })

  const notTs = [
    [],
    null,
    undefined,
    '',
    'dog',
    100,
    {
      '@mixVv6k5mnWKkJTgCIpqOsA4JeJd9Oz2gmv6rojQeXU=.ed25519': {
        'seq': 1 // invalid LHS expected to be int
      }
    },
    {
      '@chereseqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        200: '2' // invalid RHS expected to be in
      }
    },
    {
      '@bengCIpqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {} // should this be allowed...?
    },
    {
      '@chereseqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': {
        'invalid': 'invalid' // both sides invalid
      }
    },
    {
      '@chereseqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': null
    },
    { '@chereseqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': undefined },
    { '@chereseqOsA4JeJVv6k5mnWKkJTd9Oz2gmv6rojQeXU=.ed25519': 123 },
    { 123: { 200: 1 }}, // invalid feedId (number)
    { '@cherese': { 200: 1 }} // invalid feedId (not a feedId)
  ]
  notTs.forEach(T => {
    t.false(isTransformation(T), `!isTransformation : ${JSON.stringify(T)}`)
  })

  t.end()
})
