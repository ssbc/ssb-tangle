// This is the ssb-tangle@1.0.0

// const pull = require('pull-stream')
// const { isMsg } = require('ssb-ref')
// const { heads } = require('ssb-sort')

// module.exports = {
//   name: 'tangle',
//   version: require('./package.json').version,
//   manifest: {
//     branch: 'async'
//   },
//   init: (server) => {
//     checkBacklinks(server)

//     return {
//       branch: getBranch(server)
//     }
//   }
// }

// function checkBacklinks (server) {
//   setTimeout(() => {
//     if (!server.backlinks) throw new Error('ssb-tangle require ssb-backlinks to be installed')
//   }, 2e3)
// }

// function getBranch (server) {
//   if (arguments.length !== 1 || typeof arguments[0] !== 'object') throw new Error('getBacklinks needs a server as it\'s first argument!')

//   return function (rootMsgKey, cb) {
//     if (!isMsg(rootMsgKey)) return cb(new Error('getBranch requires a valid message'))

//     const query = [{
//       $filter: {
//         dest: rootMsgKey,
//         value: {
//           content: {
//             root: rootMsgKey
//           }
//         }
//       }
//     }]

//     pull(
//       server.backlinks.read({ query }),
//       pull.collect((err, msgs) => {
//         if (err) return cb(err)

//         cb(null, heads([
//           { key: rootMsgKey },
//           ...msgs
//         ]))
//       })
//     )
//   }
// }
