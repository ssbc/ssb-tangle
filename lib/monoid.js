const isEqual = require('lodash.isequal')
const merge = require('lodash.merge')

function MergeCheck (concat) {
  return (t1, t2) => isEqual(concat(t1, t2), concat(t2, t1))
}

const setMonoid = {
  concat: (t1, t2) => {
    const result = merge({}, t1)

    Object.entries(t2.data).forEach(([key, value]) => {
      if (result.data.hasOwnProperty(key)) result.data[key] += value
      else result.data[key] = value
    })

    Object.entries(result.data).forEach(([key, value]) => {
      if (value === 0) delete result.data[key]
    })

    return result
  },
  identity: () => ({ type: 'add', data: {} })
}
setMonoid.canMerge = MergeCheck(setMonoid.concat)

const mapMonoid = {
  concat: (t1, t2) => {
    return merge({}, t1, t2)
  },
  identity: () => ({ type: 'set', data: {} })
}
mapMonoid.canMerge = MergeCheck(setMonoid.concat)

const stringMonoid = {
  concat: (t1, t2) => {
    if (isEqual(t2, {})) return t1 // right side identity

    if (t2.type !== 'set') throw new Error('types other than set undefined')
    return t2
  },
  identity: () => ({})
}
stringMonoid.canMerge = MergeCheck(stringMonoid.concat)

// NOTE append too dangerous for now
//   - js strings don't guarentee unicode contents (nightmare for other langauges)
//
// const complexStringMonoid = {
//  concat: (s1, s2) => {
//    switch (s2.action) {
//      case 'set':
//        return s2

//      case 'append':
//        if (s1.action === 'set') {
//          return { action: 'set', value: s1.value + s2.value }
//        } else if (s1.action === 'append') {
//          return { action: 'append', value: s1.value + s2.value }
//        }
//        break
//    }
//  },
//  identity: { action: 'append', value: '' }
// }

module.exports = {
  stringMonoid,
  setMonoid,
  mapMonoid,

  MergeCheck
}
