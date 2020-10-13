// currently not it use, don't try using at the moment

// function climbToBranch (map, reverseMap, entryKey) {
//   while (entryKey) {
//     var target = Object.keys(reverseMap[entryKey])[0]
//     // this is shitty, it assume there's only one parent above you,
//     // there could be more if you are moving up from a merge node

//     if (Object.values(map[target]).length > 1) return target

//     entryKey = target
//   }

//   return undefined
// }

// function getFirstBranchNodeKey (map, entryKey) {
//   var queue = [entryKey]
//   var fromKey
//   var toKeys
//   var result

//   while (queue.length) {
//     fromKey = queue.pop()
//     toKeys = Object.keys(map[fromKey])

//     if (toKeys.length > 1) {
//       result = fromKey
//       break
//     }

//     queue.concat(toKeys)
//   }

//   return result
// }
