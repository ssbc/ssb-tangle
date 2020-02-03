const test = require('tape')
const OverwriteRule = require('../../../strategy/overwrite')
const SetRule = require('../../../strategy/simple-set')

const Reify = require('../../../strategy/compose/reify')

test('strategy/compose/reify', t => {
  const compostion = {
    title: OverwriteRule(),
    attendees: SetRule()
  }

  const reify = Reify(compostion)

  t.deepEqual(
    reify({
      title: { set: 'lunch with friends' },
      attendees: { mix: -1, luandro: 2, ben: 1, alanna: 0 }
    }),
    {
      title: 'lunch with friends',
      attendees: ['ben', 'luandro']
    },
    'basic reify'
  )

  t.deepEqual(
    reify({}),
    {
      title: null,
      attendees: []
    },
    'fields not mentioned are reified to their reified(identity)'
  )

  t.end()
})
