const getBranch = require('./lib/get-branch')

module.exports = {
  name: 'tangle',
  version: require('./package.json').version,
  manifest: {
    branch: 'async'
  },
  init: (server) => {
    checkBacklinks(server)

    return {
      branch: getBranch(server)
    }
  }
}

function checkBacklinks (server) {
  setTimeout(() => {
    if (!server.backlinks) throw new Error('ssb-tangle require ssb-backlinks to be installed')
  }, 2e3)
}
