const test = require('tape')
const OverwriteRule = require('../../../strategy/overwrite')
const SetRule = require('../../../strategy/simple-set')

const Concat = require('../../../strategy/compose/concat')

test('strategy/compose/concat', t => {
  const compostion = {
    title: OverwriteRule(),
    attendees: SetRule()
  }

  const concat = Concat(compostion)

  t.deepEqual(
    concat(
      {
        title: { set: 'lunch with friends' },
        attendees: { mix: 1 }
      },
      {
        attendees: { mix: -1, luandro: 1, ben: 1 }
      }
    ),
    {
      title: { set: 'lunch with friends' },
      attendees: { luandro: 1, ben: 1 }
    },
    'basic composition'
  )

  t.deepEqual(
    concat(
      {
        title: { set: 'lunch with friends' }
      },
      {
        title: { set: 'lunch with mes amis' }
      }
    ),
    {
      title: { set: 'lunch with mes amis' }
    },
    'fields not mentioned are not added'
  )

  t.end()
})
