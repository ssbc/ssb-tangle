# ssb-tangle

## Example Usage

```js
// install ssb-tangle server side
const Server = require('ssb-server')
 
// Install the plugin
Server
  .use(require('ssb-server/plugins/master')) // required
  .use(require('ssb-backlinks')) // required
  .use(require('ssb-tangle'))
 
 
// Start the server
const config = require('ssb-config') // default config
const server = Server(config)
```

```js
const Client = require('ssb-client')
const config = require('ssb-config') // default config

Client(config.keys, config, (err, server) => {
  const rootMsgKey = "%U6LeiJ6r89pb18JAikeOkwQSgNlQN8sx++1gbf2quo8=.sha256"
  server.tangle.branch(rootMsgKey, (err, branch) => {
    console.log(branch)
    // => [MsgKey, MsgKey]
  })
})
```

## API

### `server.tangle.branch(MsgKey, cb)`

Fetches the "branch" of a tangle, where: 
- `MsgKey` is the key of to "root" message of the tangle
- `cb` is an `(err, data)` style callback
  - `data` will always be an Array of MsgKey(s)
