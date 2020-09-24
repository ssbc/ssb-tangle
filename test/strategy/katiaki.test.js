const test = require('tape')
const KaitiakiRule = require('../../strategy/kaitiaki')

test.only('strategy/kaitiaki', t => {
  const {
    isTransformation,
    reify,
    concat,
    identity
  } = KaitiakiRule()

  // isTransformation /////////////////////////////

  const a = { 
    add: [{ feed: '@ben', seq: 200 }, { feed: '@cherese', seq: 500 }], 
    remove: [] 
  }
  
  const b = { 
    add: [], 
    remove: [{ feed: '@ben', seq: 500 }] 
  }

  const Ts = [
    a,
    b,
    identity() // { add: [], remove: [] }
  ]

  Ts.forEach(T => {
    t.true(isTransformation(T), `isTransformation : ${JSON.stringify(T)}`)
  })

  var testEntry = (feed, seq) => ({ feed, seq })

  const notTs = [
    'dog',
    { content: 'dog' },
    undefined,
    null,
    { set: undefined },
    { add: [], other: [] },
    { other: [], remove: [] },
    { add: null, remove: null },
    { add: undefined, remove: undefined },
    { add: '', remove: '' },
    { add: false, remove: false },
    { add: true, remove: true },
    { add: [], remove: null },
    { add: null, remove: [] },
    
    // array item
    { add: [testEntry(null, null)], remove: [] },
    { add: [testEntry(undefined, undefined)], remove: [] },
    { add: [testEntry(false, false)], remove: [] },
    { add: [testEntry(true, true)], remove: [] },
    { add: [testEntry('@ben', 200), testEntry('@mix', 400), testEntry(200, 200)], remove: [] },
    { add: [testEntry(500, '@cherese')]},
  ]
  notTs.forEach(T => {
    t.false(isTransformation(T), `!isTransformation : ${JSON.stringify(T)}`)
  })

  t.end()
})
