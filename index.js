const getBranch = require('./lib/get-branch')

module.exports = {
  name: 'tangle',
  version: require('./package.json').version,
  manifest: {
    branch: 'async'
  },
  init: (server) => {
    if (server.backlinks) throw new Error('ssb-tangle requires ssb-backlinks to work')

    return {
      branch: getBranch(server)
    }
  }
}
